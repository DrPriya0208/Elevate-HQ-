import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Stars from "@/components/Stars";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { reviewsCopy } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { formatMonthYear } from "@/lib/text";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Feedback from people who have worked with Elevate HQ.",
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
      <PageHero kicker="Reviews" title="Share your feedback" intro={reviewsCopy.intro}>
        {summary && (
          <FadeIn delay={0.25}>
            <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/5 px-5 py-3">
              <span className="font-serif text-3xl font-bold text-gold">{summary.average.toFixed(1)}</span>
              <span className="flex flex-col gap-1">
                <Stars rating={Math.round(summary.average)} />
                <span className="text-sm text-white/75">
                  from {summary.count} review{summary.count === 1 ? "" : "s"}
                </span>
              </span>
            </div>
          </FadeIn>
        )}
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FadeIn className="card p-8">
            <p className="kicker text-brass">Leave feedback</p>
            <h2 className="mt-3 font-serif text-2xl">How was your experience?</h2>
            <div className="mt-6">
              <ReviewForm />
            </div>
          </FadeIn>
        </div>

        <div>
          <SectionHeading kicker="Testimonials" title="What people have said" />

          {failed ? (
            <p className="card mt-8 p-6 text-slate">Reviews could not be loaded right now. Please try again in a few minutes.</p>
          ) : reviews.length === 0 ? (
            <p className="card mt-8 p-6 text-slate">{reviewsCopy.emptyState}</p>
          ) : (
            <>
              <Stagger as="ul" className="mt-10 space-y-5">
                {reviews.map((r) => (
                  <StaggerItem key={r.id} className="card relative p-7">
                    <span aria-hidden className="absolute right-6 top-3 font-serif text-7xl leading-none text-gold/40">“</span>
                    <Stars rating={r.rating} />
                    <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed">{r.message}</p>
                    <p className="mt-5 text-sm font-semibold text-navy">
                      {r.name}
                      <span className="font-normal text-slate"> · {formatMonthYear(r.approvedAt)}</span>
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>

              {totalPages > 1 && (
                <nav aria-label="Reviews pagination" className="mt-10 flex items-center justify-between">
                  {page > 1 ? (
                    <Link href={`/reviews?page=${page - 1}`} className="btn btn-navy !px-5 !py-2 text-sm">
                      ← Newer
                    </Link>
                  ) : <span />}
                  <span className="text-sm text-slate">Page {page} of {totalPages}</span>
                  {page < totalPages ? (
                    <Link href={`/reviews?page=${page + 1}`} className="btn btn-navy !px-5 !py-2 text-sm">
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
