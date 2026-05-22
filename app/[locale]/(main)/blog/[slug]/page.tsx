import { Metadata } from 'next';
import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import BlogPageRenderer from '@/components/public/blog/BlogPageRenderer';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return {};

  return {
    title: `Angkor Float Sanctuary | ${post.metaTitle || post.title}`,
    description: post.metaDescription || post.caption || 'Discover the therapeutic benefits of floating at Angkor Float Sanctuary.',
    keywords: post.keywords || 'Angkor Float Sanctuary, floatation therapy, sensory deprivation, Siem Reap, wellness, spa',
    alternates: {
      canonical: post.canonicalUrl ?? undefined,
    },
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.metaDescription || post.caption || 'Discover the therapeutic benefits of floating at Angkor Float Sanctuary.',
      images: post.ogImageUrl ? [{ url: post.ogImageUrl }] : [{ url: '/images/meta/img-default.jpg' }],
      type: (post.ogType as any) || 'article',
    },
    robots: post.robots || 'index, follow',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post) {
    notFound();
  }

  const serializedPost = {
    ...post,
    author: post.author ? {
      ...post.author,
      image: post.author.image
        ? `data:image/png;base64,${Buffer.from(post.author.image).toString('base64')}`
        : null
    } : null
  };

  return (
    <div className="flex flex-col flex-1 w-full font-sans">
      <BlogPageRenderer content={post.content} post={serializedPost as any} />
    </div>
  );
}

// Optional: Genera percorsi statici per performance migliori se necessario
// export async function generateStaticParams() {
//   const posts = await prisma.blogPost.findMany({ select: { slug: true } });
//   return posts.map((post) => ({ slug: post.slug }));
// }
