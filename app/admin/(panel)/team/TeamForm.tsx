"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitWithoutReset } from "@/lib/submitWithoutReset";
import type { FormState } from "@/lib/types";
import PhotoField from "@/app/admin/PhotoField";
import { teamRoles } from "@/lib/teamRoles";

const OTHER = "__other";

export type TeamValues = {
  name: string;
  role: string;
  bio: string;
  qualifications: string;
  languages: string;
  linkedin: string;
  photo: string;
  sortOrder: number;
  active: boolean;
};

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  member?: TeamValues;
  submitLabel: string;
};

export default function TeamForm({ action, member, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);
  const [uploading, setUploading] = useState(false);
  // A saved role that is not in the list (typed via "Other") opens with "Other" selected and the text filled
  const knownRole = !member?.role || (teamRoles as readonly string[]).includes(member.role);
  const [roleChoice, setRoleChoice] = useState(member?.role ? (knownRole ? member.role : OTHER) : "");

  return (
    <form action={formAction} onSubmit={(e) => submitWithoutReset(e, formAction)} className="space-y-6">
      <PhotoField
        initial={member?.photo ?? ""}
        help="A square, head-and-shoulders photo works best. Without one, the first letter of the name is shown."
        onUploadingChange={setUploading}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" type="text" required minLength={2} maxLength={80} defaultValue={member?.name} className="field" />
        </div>
        <div>
          <label htmlFor="roleChoice" className="label">Role</label>
          <select
            id="roleChoice"
            name={roleChoice === OTHER ? undefined : "role"}
            required
            value={roleChoice}
            onChange={(e) => setRoleChoice(e.target.value)}
            className="field"
          >
            <option value="" disabled>
              Choose a role
            </option>
            {teamRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value={OTHER}>Other (type your own)</option>
          </select>
          {roleChoice === OTHER && (
            <>
              <label htmlFor="role" className="sr-only">Role, typed</label>
              <input
                id="role"
                name="role"
                type="text"
                required
                minLength={2}
                maxLength={80}
                defaultValue={knownRole ? "" : member?.role}
                placeholder="Type the role"
                autoFocus={!member}
                className="field mt-2"
              />
            </>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="label">Short bio</label>
        <textarea id="bio" name="bio" required minLength={20} maxLength={1500} rows={5} defaultValue={member?.bio} className="field" />
      </div>

      <div>
        <label htmlFor="qualifications" className="label">Qualifications and certifications (optional)</label>
        <textarea
          id="qualifications"
          name="qualifications"
          maxLength={2000}
          rows={4}
          defaultValue={member?.qualifications}
          placeholder="One per line"
          className="field"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="languages" className="label">Languages (optional)</label>
          <input
            id="languages"
            name="languages"
            type="text"
            maxLength={120}
            defaultValue={member?.languages}
            placeholder="e.g. English, Tamil, Hindi"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="label">LinkedIn link (optional)</label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            defaultValue={member?.linkedin}
            placeholder="https://www.linkedin.com/in/…"
            className="field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
        <div>
          <label htmlFor="sortOrder" className="label">Display order</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            max={999}
            step={1}
            defaultValue={member?.sortOrder ?? 0}
            aria-describedby="sortOrder-help"
            className="field"
          />
          <p id="sortOrder-help" className="mt-1.5 text-sm text-slate">Lower numbers show first.</p>
        </div>
        <label className="flex items-center gap-3 pb-8">
          <input type="checkbox" name="active" defaultChecked={member?.active ?? true} className="h-5 w-5 accent-navy" />
          <span className="font-semibold">Show on the website</span>
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending || uploading} className="btn btn-navy disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin/team" className="font-semibold underline underline-offset-4">Cancel</Link>
      </div>
    </form>
  );
}
