import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/CtaBand";
import { FadeIn } from "@/components/motion";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/text";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    return post && post.published ? post : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : ["/elevatehq-logo-dark-playfair-1024.png"],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14">
        <Link href="/blog" className="text-sm font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
          All posts
        </Link>
        <FadeIn>
          <p className="mt-8 text-sm text-slate">{formatDate(post.publishedAt)}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">{post.title}</h1>

          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" className="mt-8 w-full rounded-md object-cover" />
          )}

          <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: post.content }} />
        </FadeIn>
      </article>
      <CtaBand />
    </>
  );
}
