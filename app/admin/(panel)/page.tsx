import Link from "next/link";
import DeleteButton from "@/app/admin/DeleteButton";
import { deleteEnquiry, deletePost } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/text";

export default async function AdminDashboard() {
  const [posts, enquiries, pendingReviews] = await Promise.all([
    prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.review.count({ where: { status: "PENDING" } }),
  ]);

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

      <section>
        <h2 className="font-serif text-3xl">Enquiries</h2>
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
                      {new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
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
      </section>
    </div>
  );
}
