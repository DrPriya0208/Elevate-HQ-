import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/CtaBand";
import HeroGlow from "@/components/HeroGlow";
import { DrawLine, FadeIn, RevealText } from "@/components/motion";
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
      <header className="speckle relative overflow-hidden bg-navy text-white">
        <HeroGlow />
        <div className={`relative mx-auto max-w-3xl px-6 pt-16 ${post.coverImage ? "pb-36" : "pb-16"}`}>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-white">
            <span aria-hidden="true">←</span> All posts
          </Link>
          <FadeIn>
            <p className="kicker mt-10 text-gold">{formatDate(post.publishedAt)}</p>
          </FadeIn>
          <RevealText as="h1" text={post.title} className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl" />
          <DrawLine className="mt-6 block h-[3px] w-20 origin-left rounded-full bg-gold" />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-20">
        {post.coverImage && (
          <FadeIn className="-mt-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              className="relative aspect-[16/9] w-full rounded-xl object-cover shadow-[0_20px_40px_rgba(10,21,48,0.25)]"
            />
          </FadeIn>
        )}
        <FadeIn>
          <div className="post-body mt-12" dangerouslySetInnerHTML={{ __html: post.content }} />
        </FadeIn>
        <div className="mt-16 border-t border-line pt-8">
          <Link href="/blog" className="btn btn-navy">← More articles</Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
