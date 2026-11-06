import Link from "next/link";
import DeleteButton from "@/app/admin/DeleteButton";
import { deleteEnquiry, deletePost } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/text";

const ENQUIRIES_PER_PAGE = 20;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function AdminDashboard({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const enquiryTotal = await prisma.enquiry.count();
  const pageCount = Math.max(1, Math.ceil(enquiryTotal / ENQUIRIES_PER_PAGE));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1));

  const [posts, enquiries, pendingReviews] = await Promise.all([
    prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ENQUIRIES_PER_PAGE,
      take: ENQUIRIES_PER_PAGE,
    }),
    prisma.review.count({ where: { status: "PENDING" } }),
  ]);
  const firstShown = (page - 1) * ENQUIRIES_PER_PAGE + 1;
  const lastShown = firstShown + enquiries.length - 1;

  return (
    <div className="space-y-14">
      <Link
        href="/admin/reviews"
        className="block rounded-md border border-gold bg-white px-5 py-4 font-semibold hover:border-brass"
      >
        {pendingReviews} review{pendingReviews === 1 ? "" : "s"} waiting →
      </Link>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-3xl">Blog posts</h1>
          <Link href="/admin/posts/new" className="btn btn-navy">New post</Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 rounded-md border border-line bg-white p-6 text-slate">
            No posts yet. Select “New post” to write the first one.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line rounded-md border border-line bg-white">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-serif text-xl">{p.title}</p>
                  <p className="mt-0.5 text-sm text-slate">
                    {p.published ? `Published ${formatDate(p.publishedAt)}` : "Draft"} · /blog/{p.slug}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  {p.published && (
                    <Link href={`/blog/${p.slug}`} target="_blank" className="text-sm font-semibold underline underline-offset-4">
                      View
                    </Link>
                  )}
                  <Link href={`/admin/posts/${p.id}/edit`} className="text-sm font-semibold underline underline-offset-4">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deletePost.bind(null, p.id)}
                    confirmText={`“${p.title}” will be permanently deleted${p.published ? " and removed from the website" : ""}. This cannot be undone.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="enquiries" className="scroll-mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-3xl">Enquiries</h2>
          {enquiryTotal > 0 && (
            <p className="text-sm text-slate">
              {enquiryTotal > ENQUIRIES_PER_PAGE ? `Showing ${firstShown}–${lastShown} of ${enquiryTotal}` : `${enquiryTotal} in total`}
            </p>
          )}
        </div>
        {enquiries.length === 0 ? (
          <p className="mt-6 rounded-md border border-line bg-white p-6 text-slate">
            No enquiries yet. Messages sent from the contact page appear here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line rounded-md border border-line bg-white">
            {enquiries.map((e) => (
              <li key={e.id} className="px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{e.name}</p>
                  <div className="flex items-baseline gap-5">
                    <p className="text-sm text-slate">
                      {new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                    </p>
                    <DeleteButton
                      action={deleteEnquiry.bind(null, e.id)}
                      title="Delete enquiry?"
                      confirmText={`The enquiry from ${e.name} will be permanently deleted. This cannot be undone.`}
                    />
                  </div>
                </div>
                <p className="mt-0.5 text-sm text-slate">
                  <a href={`mailto:${e.email}`} className="underline underline-offset-4">{e.email}</a>
                  {e.phone ? ` · ${e.phone}` : ""} · {e.interest}
                  {e.organisation ? ` · ${e.organisation}` : ""}
                </p>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed">{e.message}</p>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <nav aria-label="Enquiry pages" className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {page > 1 ? (
              <Link href={`/admin?page=${page - 1}#enquiries`} className="btn border border-line bg-white text-navy hover:border-brass">
                Newer
              </Link>
            ) : (
              <span />
            )}
            <p className="text-sm text-slate">
              Page {page} of {pageCount}
            </p>
            {page < pageCount ? (
              <Link href={`/admin?page=${page + 1}#enquiries`} className="btn border border-line bg-white text-navy hover:border-brass">
                Older
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </div>
  );
}
