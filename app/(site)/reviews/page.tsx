import type { Metadata } from "next";
import Link from "next/link";
import HeroGlow from "@/components/HeroGlow";
import Stars from "@/components/Stars";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { reviewsCopy } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { formatMonthYear } from "@/lib/text";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Feedback from people who have worked with ElevateHQ.",
};

const PAGE_SIZE = 10;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function ReviewsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let reviews: { id: string; name: string; rating: number; message: string; approvedAt: Date | null }[] = [];
  let total = 0;
  let summary: { count: number; average: number } | null = null;
  let failed = false;

  try {
    const [rows, count, agg] = await Promise.all([
      prisma.review.findMany({
        where: { status: "APPROVED" },
        orderBy: { approvedAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { id: true, name: true, rating: true, message: true, approvedAt: true },
      }),
      prisma.review.count({ where: { status: "APPROVED" } }),
      prisma.review.aggregate({ where: { status: "APPROVED" }, _avg: { rating: true }, _count: true }),
    ]);
    reviews = rows;
    total = count;
    if (agg._count >= 3) summary = { count: agg._count, average: agg._avg.rating ?? 0 };
  } catch {
    failed = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <HeroGlow />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <FadeIn>
            <h1 className="font-serif text-4xl text-white sm:text-5xl">Share your feedback</h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">{reviewsCopy.intro}</p>
            {summary && (
              <p className="mt-6 flex items-center gap-2 text-white/90">
                <Stars rating={Math.round(summary.average)} />
                <span>
                  {summary.average.toFixed(1)} average from {summary.count} review{summary.count === 1 ? "" : "s"}
                </span>
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <FadeIn>
          <h2 className="font-serif text-2xl">Leave feedback</h2>
          <div className="mt-6">
            <ReviewForm />
          </div>
        </FadeIn>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <FadeIn><h2 className="font-serif text-2xl">What people have said</h2></FadeIn>

          {failed ? (
            <p className="mt-6 text-slate">Reviews could not be loaded right now. Please try again in a few minutes.</p>
          ) : reviews.length === 0 ? (
            <p className="mt-6 text-slate">{reviewsCopy.emptyState}</p>
          ) : (
            <>
              <Stagger as="ul" className="mt-6 space-y-10">
                {reviews.map((r) => (
                  <StaggerItem key={r.id}>
                    <Stars rating={r.rating} />
                    <p className="mt-3 whitespace-pre-line font-serif text-xl leading-relaxed">{r.message}</p>
                    <p className="mt-3 text-sm text-slate">
                      {r.name} · {formatMonthYear(r.approvedAt)}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>

              {totalPages > 1 && (
                <nav aria-label="Reviews pagination" className="mt-10 flex items-center justify-between">
                  {page > 1 ? (
                    <Link href={`/reviews?page=${page - 1}`} className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
                      ← Newer
                    </Link>
                  ) : <span />}
                  <span className="text-sm text-slate">Page {page} of {totalPages}</span>
                  {page < totalPages ? (
                    <Link href={`/reviews?page=${page + 1}`} className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
                      Older →
                    </Link>
                  ) : <span />}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
