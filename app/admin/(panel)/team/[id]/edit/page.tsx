import { notFound } from "next/navigation";
import { updateTeamMember } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import TeamForm from "../../TeamForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditTeamMemberPage({ params }: Props) {
  const { id } = await params;
  const m = await prisma.teamMember.findUnique({ where: { id } });
  if (!m) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit team member</h1>
      <div className="mt-8">
        <TeamForm
          action={updateTeamMember.bind(null, m.id)}
          submitLabel="Save changes"
          member={{
            name: m.name,
            role: m.role,
            bio: m.bio,
            qualifications: m.qualifications,
            languages: m.languages ?? "",
            linkedin: m.linkedin ?? "",
            photo: m.photo ?? "",
            sortOrder: m.sortOrder,
            active: m.active,
          }}
        />
      </div>
    </div>
  );
}
