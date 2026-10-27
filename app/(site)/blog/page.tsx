import type { Metadata } from "next";
import Link from "next/link";
import HeroGlow from "@/components/HeroGlow";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/text";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on mental health, relationships, and personal growth from ElevateHQ.",
};

export default async function BlogPage() {
  let posts: { id: string; slug: string; title: string; excerpt: string; publishedAt: Date | null }[] = [];
  let failed = false;

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, publishedAt: true },
    });
  } catch {
    failed = true;
  }

  return (
    <>
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <HeroGlow />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <FadeIn>
            <h1 className="font-serif text-4xl text-white sm:text-5xl">Blog</h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              Notes on mental health, relationships, and personal growth.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {failed ? (
          <p className="text-slate">Posts could not be loaded right now. Please try again in a few minutes.</p>
        ) : posts.length === 0 ? (
          <p className="text-slate">No posts yet. Please check back soon.</p>
        ) : (
          <Stagger as="ul" className="space-y-12">
            {posts.map((p) => (
              <StaggerItem key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <p className="text-sm text-slate">{formatDate(p.publishedAt)}</p>
                  <h2 className="mt-1 font-serif text-3xl leading-snug group-hover:underline group-hover:decoration-brass group-hover:underline-offset-4">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-navy/90">{p.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </>
  );
}
