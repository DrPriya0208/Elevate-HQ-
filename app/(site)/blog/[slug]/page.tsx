import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { postFontVariables } from "@/app/postFontLoaders";
import { OG_IMAGE, TWITTER_LARGE } from "@/lib/seo";
import CtaBand from "@/components/CtaBand";
import ShareButtons from "@/components/ShareButtons";
import StarField from "@/components/StarField";
import { site } from "@/lib/content";
import { FadeIn, RevealText } from "@/components/motion";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/text";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

// null means "no such published post" (a real 404). A database error is NOT caught here: it
// propagates so Next keeps serving the last good cached copy (or the (site) error page), instead of
// caching a live article as a 404. cache() shares one query between generateMetadata and the page.
const getPost = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  return post && post.published ? post : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      url: `/blog/${post.slug}`,
      siteName: site.name,
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      // The post's own cover photo, or the site's 1200x630 preview image
      images: post.coverImage ? [post.coverImage] : [OG_IMAGE],
    },
    twitter: TWITTER_LARGE,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <header className="speckle relative overflow-hidden bg-navy text-white">
        <StarField />
        <div className={`relative mx-auto max-w-3xl px-6 pt-16 ${post.coverImage ? "pb-36" : "pb-16"}`}>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-white">
            <span aria-hidden="true">←</span> All posts
          </Link>
          <FadeIn>
            <p className="kicker mt-10 text-gold">{formatDate(post.publishedAt)}</p>
          </FadeIn>
          <RevealText as="h1" text={post.title} className="mt-3 font-serif text-4xl leading-tight text-white sm:text-5xl" />
        </div>
      </header>

      <article className={`mx-auto max-w-3xl px-6 pb-20 ${postFontVariables}`}>
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
        <p className="mt-16 border-t border-line pt-8 text-sm text-slate">
          Last updated: <time dateTime={post.updatedAt.toISOString()}>{formatDate(post.updatedAt)}</time>
        </p>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <ShareButtons url={`${site.url}/blog/${post.slug}`} title={post.title} />
          <Link href="/blog" className="btn btn-navy shrink-0 self-start">← More articles</Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
