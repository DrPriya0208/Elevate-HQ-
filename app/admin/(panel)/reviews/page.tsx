import Link from "next/link";
import ActionButton from "@/app/admin/ActionButton";
import DeleteButton from "@/app/admin/DeleteButton";
import Stars from "@/components/Stars";
import {
  approveReview,
  deleteReview,
  featureReview,
  hideReview,
  unfeatureReview,
} from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import type { ReviewStatus } from "@prisma/client";

type Props = { searchParams: Promise<{ status?: string }> };

const tabs: { key: ReviewStatus; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "HIDDEN", label: "Hidden" },
];

function parseStatus(value: string | undefined): ReviewStatus {
  const upper = value?.toUpperCase();
  return tabs.some((t) => t.key === upper) ? (upper as ReviewStatus) : "PENDING";
}

export default async function AdminReviewsPage({ searchParams }: Props) {
  const { status: statusParam } = await searchParams;
  const status = parseStatus(statusParam);

  const [reviews, counts] = await Promise.all([
    prisma.review.findMany({
      where: { status },
      orderBy: status === "APPROVED" ? { approvedAt: "desc" } : { createdAt: "desc" },
    }),
    prisma.review.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (key: ReviewStatus) => counts.find((c) => c.status === key)?._count ?? 0;

  return (
    <div>
      <h1 className="font-serif text-3xl">Reviews</h1>

      <div className="mt-6 flex gap-6 border-b border-line">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/reviews?status=${t.key.toLowerCase()}`}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
              status === t.key ? "border-navy text-navy" : "border-transparent text-slate hover:text-navy"
            }`}
          >
            {t.label} ({countFor(t.key)})
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 rounded-md border border-line bg-white p-6 text-slate">
          No {status.toLowerCase()} reviews.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-md border border-line bg-white">
          {reviews.map((r) => (
            <li key={r.id} className="px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} />
                    <p className="font-semibold">{r.name}</p>
                    {r.featured && <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-ink">Featured</span>}
                  </div>
                  <p className="mt-2 whitespace-pre-line leading-relaxed">{r.message}</p>
                  <p className="mt-2 text-sm text-slate">
                    {new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-4">
                  {status !== "APPROVED" && <ActionButton action={approveReview.bind(null, r.id)} label="Approve" />}
                  {status !== "HIDDEN" && <ActionButton action={hideReview.bind(null, r.id)} label="Hide" />}
                  {status === "APPROVED" && (
                    r.featured
                      ? <ActionButton action={unfeatureReview.bind(null, r.id)} label="Unfeature" />
                      : <ActionButton action={featureReview.bind(null, r.id)} label="Feature" />
                  )}
                  <Link href={`/admin/reviews/${r.id}/edit`} className="text-sm font-semibold underline underline-offset-4">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteReview.bind(null, r.id)}
                    confirmText="Delete this review? This cannot be undone."
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
