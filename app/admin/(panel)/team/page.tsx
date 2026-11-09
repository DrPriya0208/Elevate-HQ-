import Link from "next/link";
import ActionButton from "@/app/admin/ActionButton";
import DeleteButton from "@/app/admin/DeleteButton";
import { deleteTeamMember, setTeamMemberActive } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Team</h1>
        <Link href="/admin/team/new" className="btn btn-navy">Add member</Link>
      </div>
      <p className="mt-2 text-slate">
        Members shown here appear on the About page, below the founders, and as a choice in the contact form. The
        founders&apos; own cards are part of the About page and are not listed here.
      </p>

      {members.length === 0 ? (
        <p className="mt-6 rounded-md border border-line bg-white p-6 text-slate">
          No team members yet. Until you add one, the website shows only the founders and the contact form has no
          team choice.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-md border border-line bg-white">
          {members.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-4">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-lg text-gold">
                    {m.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="truncate">{m.name}</span>
                    {!m.active && <span className="rounded-full bg-line px-2.5 py-0.5 text-xs font-semibold text-slate">Hidden</span>}
                  </p>
                  <p className="text-sm text-slate">
                    {m.role} · order {m.sortOrder}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <ActionButton action={setTeamMemberActive.bind(null, m.id, !m.active)} label={m.active ? "Hide" : "Show"} />
                <Link href={`/admin/team/${m.id}/edit`} className="text-sm font-semibold underline underline-offset-4">
                  Edit
                </Link>
                <DeleteButton
                  action={deleteTeamMember.bind(null, m.id)}
                  title="Delete team member?"
                  confirmText={`${m.name} will be removed from the website and the contact form. This cannot be undone. To take them off the site for now, use Hide instead.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
