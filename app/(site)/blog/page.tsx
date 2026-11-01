import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Stagger, StaggerItem } from "@/components/motion";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/text";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on mental health, relationships, and personal growth from ElevateHQ.",
};

type PostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
};

function Cover({ src, large = false }: { src: string | null; large?: boolean }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    );
  }
  return (
    <div className="speckle flex h-full items-center justify-center bg-navy">
      <Image
        src="/elevatehq-logo-dark-playfair.svg"
        alt=""
        width={large ? 140 : 88}
        height={large ? 140 : 88}
        priority
        className="opacity-80 transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export default async function BlogPage() {
  let posts: PostCard[] = [];
  let failed = false;

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true },
    });
  } catch {
    failed = true;
  }

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero kicker="Blog" title="Notes on minds, work and wellbeing." intro="Articles on mental health, relationships, workplaces and personal growth." />

      <div className="mx-auto max-w-6xl px-6 py-20">
        {failed ? (
          <p className="card p-8 text-slate">Posts could not be loaded right now. Please try again in a few minutes.</p>
        ) : !featured ? (
          <p className="card p-8 text-slate">No posts yet. Please check back soon.</p>
        ) : (
          <>
            <Stagger as="div">
              <StaggerItem as="div">
                <Link href={`/blog/${featured.slug}`} className="card card-hover group grid overflow-hidden md:grid-cols-2">
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[22rem]">
                    <Cover src={featured.coverImage} large />
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <p className="kicker text-brass">Latest · {formatDate(featured.publishedAt)}</p>
                    <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">{featured.title}</h2>
                    <p className="mt-4 line-clamp-4 text-lg leading-relaxed text-navy/80">{featured.excerpt}</p>
                    <span className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brass">
                      Read article
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            </Stagger>

            {rest.length > 0 && (
              <Stagger as="ul" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <StaggerItem key={p.id} className="h-full">
                    <Link href={`/blog/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Cover src={p.coverImage} />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-sm text-slate">{formatDate(p.publishedAt)}</p>
                        <h2 className="mt-2 font-serif text-xl leading-snug">{p.title}</h2>
                        <p className="mt-3 line-clamp-3 leading-relaxed text-navy/80">{p.excerpt}</p>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brass">
                          Read article
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </>
        )}
      </div>
    </>
  );
}
