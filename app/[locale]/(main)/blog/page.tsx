import { Metadata } from 'next';
import { Suspense } from 'react';
import prisma from "@/lib/prisma";
import { setRequestLocale, getTranslations } from "next-intl/server";
import BlogListClient from '@/components/public/blog/BlogListClient';
import BlogListSkeleton from '@/components/public/blog/BlogListSkeleton';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  const title = `Angkor Float Sanctuary | ${t('title')}`;
  const description = t('subtitle');
  const imageUrl = '/images/meta/img-blog.jpg';

  return {
    title,
    description,
    keywords: 'Angkor Float Sanctuary, blog, floatation therapy articles, wellness insights, nervous system regulation, Siem Reap',
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    robots: 'index, follow',
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const resolvedSearchParams = await searchParams;
  const limitParam = resolvedSearchParams?.limit;
  const limit = limitParam ? parseInt(limitParam as string, 10) : 6;
  const validLimit = isNaN(limit) || limit < 6 || limit > 24 || (limit - 6) % 3 !== 0 ? 6 : limit;

  // Fetch all posts with categories and author details
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: {
      categories: true,
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch all categories to populate the interactive filter dropdown
  const categories = await prisma.postCategory.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  // Serialize models to clean client-ready JSON objects
  const serializedPosts = posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    caption: post.caption,
    createdAt: post.createdAt.toISOString(),
    thumbnailUrl: post.thumbnailUrl,
    thumbnailImage: post.thumbnailImage
      ? `data:image/png;base64,${Buffer.from(post.thumbnailImage).toString('base64')}`
      : null,
    pageTheme: post.pageTheme,
    content: post.content,
    categories: post.categories.map(c => ({ id: c.id, name: c.name })),
    author: post.author ? {
      id: post.author.id,
      name: post.author.name,
      surname: post.author.surname,
      imageUrl: post.author.imageUrl,
      image: post.author.image
        ? `data:image/png;base64,${Buffer.from(post.author.image).toString('base64')}`
        : null
    } : null
  }));

  const serializedCategories = categories.map(c => ({
    id: c.id,
    name: c.name
  }));

  return (
    <Suspense fallback={<BlogListSkeleton limit={validLimit} />}>
      <BlogListClient 
        initialPosts={serializedPosts} 
        categories={serializedCategories} 
      />
    </Suspense>
  );
}
