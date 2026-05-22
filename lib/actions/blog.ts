"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/routing";
import { uploadFileToR2, deleteFileFromR2 } from "@/lib/r2";

async function checkPermission(permission: string) {
  const session = await auth();
  const permissions = (session?.user as any)?.permissions || [];
  const roles = (session?.user as any)?.roles || [];
  const isSuperAdmin = roles.includes("SUPERADMIN") || roles.includes("ADMIN");

  if (!isSuperAdmin && !permissions.includes(permission)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function deleteBlogPost(id: string) {
  await checkPermission("blog:delete");
  
  // Find the post first to delete its R2 assets
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { images: true }
  });

  if (post) {
    if (post.thumbnailUrl) {
      await deleteFileFromR2(post.thumbnailUrl);
    }
    if (post.ogImageUrl) {
      await deleteFileFromR2(post.ogImageUrl);
    }
    
    // Also delete any other R2 media associated with this post
    if (post.images && post.images.length > 0) {
      for (const media of post.images) {
        if (media.url) {
          await deleteFileFromR2(media.url);
        }
      }
    }

    // Parse content to see if there are any other inline R2 images that might not be in the Media table
    try {
      if (post.content) {
        const modules = JSON.parse(post.content);
        for (const module of modules) {
          const imageSrc = module.props?.imageSrc;
          if (imageSrc && imageSrc.startsWith("http")) {
            await deleteFileFromR2(imageSrc);
          }
        }
      }
    } catch (e) {
      console.error("[Blog Action] Failed to clean up inline R2 images during post deletion:", e);
    }
  }

  // Delete associated Media records to prevent Foreign Key constraint violations
  await prisma.media.deleteMany({
    where: { postId: id }
  });

  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

export async function bulkDeleteBlogPosts(ids: string[]) {
  await checkPermission("blog:delete");
  
  for (const id of ids) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { images: true }
    });

    if (post) {
      if (post.thumbnailUrl) await deleteFileFromR2(post.thumbnailUrl);
      if (post.ogImageUrl) await deleteFileFromR2(post.ogImageUrl);
      
      if (post.images && post.images.length > 0) {
        for (const media of post.images) {
          if (media.url) await deleteFileFromR2(media.url);
        }
      }

      try {
        if (post.content) {
          const modules = JSON.parse(post.content);
          for (const module of modules) {
            const imageSrc = module.props?.imageSrc;
            if (imageSrc && imageSrc.startsWith("http")) {
              await deleteFileFromR2(imageSrc);
            }
          }
        }
      } catch (e) {
        console.error("[Blog Action] Failed to clean up inline R2 images during bulk deletion:", e);
      }
    }
  }

  // Delete associated Media records to prevent Foreign Key constraint violations
  await prisma.media.deleteMany({
    where: { postId: { in: ids } }
  });

  await prisma.blogPost.deleteMany({
    where: { id: { in: ids } }
  });
  
  revalidatePath("/admin/blog");
}

export async function bulkUnpublishBlogPosts(ids: string[]) {
  await checkPermission("blog:publish");
  
  await prisma.blogPost.updateMany({
    where: { id: { in: ids } },
    data: { published: false }
  });
  
  revalidatePath("/admin/blog");
}

export async function bulkPublishBlogPosts(ids: string[]) {
  await checkPermission("blog:publish");
  
  await prisma.blogPost.updateMany({
    where: { id: { in: ids } },
    data: { published: true }
  });
  
  revalidatePath("/admin/blog");
}

import { getLocale } from "next-intl/server";

async function handleImageUpload(file: File | null, folderPath: string, prefix: string) {
  if (!file || file.size === 0) return { url: null };
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split('.').pop() || 'png';
  const uniqueFileName = `${prefix}-${Date.now()}.${fileExtension}`;

  const uploadedUrl = await uploadFileToR2(
    buffer,
    folderPath,
    uniqueFileName,
    file.type
  );

  if (uploadedUrl) {
    return { url: uploadedUrl };
  }
  
  throw new Error(`Failed to upload image ${file.name} to R2 storage. Please check Cloudflare configuration.`);
}

export async function saveBlogPost(prevState: any, formData: FormData, id?: string) {
  const session = await auth();
  if (!session?.user) return "Unauthorized";
  
  try {
    console.log("[Blog Action] Saving post. Session User:", session.user);
    
    const permissions = (session?.user as any)?.permissions || [];
    const roles = (session?.user as any)?.roles || [];
    const isSuperAdmin = roles.includes("SUPERADMIN") || roles.includes("ADMIN");

    if (id) {
      await checkPermission("blog:update");
    } else {
      await checkPermission("blog:create");
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const caption = formData.get("caption") as string;
    let contentStr = formData.get("content") as string;
    const published = formData.get("published") === "true";
    const showAuthor = formData.get("showAuthor") === "true";
    const categoryIdsStr = formData.get("categoryIds") as string;
    const categoryIds = categoryIdsStr ? categoryIdsStr.split(",") : [];

    // Enforce publish permission
    const canPublish = isSuperAdmin || permissions.includes("blog:publish");
    let isChangingPublished = false;
    if (id) {
      const existingPost = await prisma.blogPost.findUnique({ where: { id }, select: { published: true } });
      if (existingPost && existingPost.published !== published) {
        isChangingPublished = true;
      }
    } else {
      if (published) {
        isChangingPublished = true;
      }
    }

    if (isChangingPublished && !canPublish) {
      return "You do not have permission to publish or unpublish this article.";
    }

    const thumbnailCaption = formData.get("thumbnailCaption") as string;
    
    // SEO Fields
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const keywords = formData.get("keywords") as string;
    const robots = formData.get("robots") as string;
    const ogTitle = formData.get("ogTitle") as string;
    const ogDescription = formData.get("ogDescription") as string;
    const ogType = formData.get("ogType") as string;
    const canonicalUrl = formData.get("canonicalUrl") as string;
    const pageTheme = formData.get("pageTheme") as string;

    if (!title || !slug || !contentStr) {
      return "Missing required fields";
    }

    // Retrieve previous post details to clean up replaced assets
    let existingPost: any = null;
    if (id) {
      existingPost = await prisma.blogPost.findUnique({
        where: { id },
        select: { thumbnailUrl: true, ogImageUrl: true },
      });
    }

    // Handle Thumbnail
    const thumbnailFile = formData.get("thumbnailImage") as File | null;
    const thumbnailResult = await handleImageUpload(
      thumbnailFile,
      "blog-posts/thumbnails",
      `post-thumb-${id || 'new'}`
    );
    if (thumbnailResult.url && existingPost?.thumbnailUrl) {
      await deleteFileFromR2(existingPost.thumbnailUrl);
    }

    // Handle OG Image
    const ogImageFile = formData.get("ogImage") as File | null;
    const ogResult = await handleImageUpload(
      ogImageFile,
      "blog-posts/og-images",
      `post-og-${id || 'new'}`
    );
    if (ogResult.url && existingPost?.ogImageUrl) {
      await deleteFileFromR2(existingPost.ogImageUrl);
    }

    // Handle Module Images
    // We need to parse content, find image fields, and check if there's a corresponding file in formData
    const modules = JSON.parse(contentStr);
    const updatedModules = [...modules];

    for (let i = 0; i < updatedModules.length; i++) {
      const module = updatedModules[i];
      // Check for image fields in props
      // We expect the form to send files named "module_${module.id}_image"
      const moduleFile = formData.get(`module_${module.id}_image`) as File | null;
      if (moduleFile && moduleFile.size > 0) {
        const result = await handleImageUpload(
          moduleFile,
          "blog-posts/images",
          `post-module-${module.type}-${id || 'new'}`
        );
        if (result.url) {
          // If we are replacing an existing R2 image, clean it up
          const previousSrc = module.props?.imageSrc;
          if (previousSrc && previousSrc.startsWith("http")) {
            await deleteFileFromR2(previousSrc);
          }
          module.props.imageSrc = result.url;
        }
      } else if (module.props?.imageSrc && module.props.imageSrc.startsWith("data:image/")) {
        // Fallback: If a base64 string somehow made it into the JSON without a file attachment,
        // we strip it to prevent SQLITE_TOOBIG errors.
        module.props.imageSrc = null;
      }
    }

    // WORKAROUND: Validate authorId to prevent Foreign Key violations if session is stale
    let finalAuthorId = session.user.id as string;
    const authorExists = await prisma.user.findUnique({ where: { id: finalAuthorId } });
    
    if (!authorExists) {
      console.warn(`[Blog Action] Session user ID ${finalAuthorId} not found in DB. Falling back to first available user.`);
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) return "No users found in database. Please seed the database.";
      finalAuthorId = firstUser.id;
    }

    const data: any = {
      title,
      slug,
      caption,
      content: JSON.stringify(updatedModules),
      published,
      showAuthor,
      thumbnailCaption,
      metaTitle,
      metaDescription,
      keywords,
      robots,
      ogTitle,
      ogDescription,
      ogType,
      canonicalUrl,
      pageTheme,
      authorId: finalAuthorId,
    };

    if (thumbnailResult.url) {
      data.thumbnailUrl = thumbnailResult.url; 
      data.thumbnailImage = null; // Wipe out legacy blobs if they exist
    }

    if (ogResult.url) {
      data.ogImageUrl = ogResult.url;
      data.ogImage = null; // Wipe out legacy blobs if they exist
    }

    let post;
    if (id) {
      post = await prisma.blogPost.update({
        where: { id },
        data: {
          ...data,
          categories: {
            set: categoryIds.map(catId => ({ id: catId }))
          }
        },
      });
      // Delete old media for this post before recreating? 
      // For simplicity, let's just add new ones for now.
    } else {
      post = await prisma.blogPost.create({
        data: {
          ...data,
          categories: {
            connect: categoryIds.map(catId => ({ id: catId }))
          }
        },
      });
    }

    // No more media dynamic fallback array to save into SQLite since we strictly use R2.

  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("[Blog Action] Error saving post:", error);
    return error.message || "Failed to save post.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/blog");
  redirect({ href: "/admin/blog", locale });
}
