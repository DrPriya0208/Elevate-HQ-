import { createTeamMember } from "@/lib/actions";
import TeamForm from "../TeamForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">Add team member</h1>
      <p className="mt-2 text-slate">They appear on the About page and in the contact form once saved with “Show on the website” ticked.</p>
      <div className="mt-8">
        <TeamForm action={createTeamMember} submitLabel="Add member" />
      </div>
    </div>
  );
}
