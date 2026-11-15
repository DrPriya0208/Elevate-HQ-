"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import PhotoField from "@/app/admin/PhotoField";
import type { FounderFormValues, FounderKey } from "@/lib/founders";
import { submitWithoutReset } from "@/lib/submitWithoutReset";
import type { FormState } from "@/lib/types";

type Props = {
  kind: FounderKey;
  values: FounderFormValues;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

/** Edits one founder card. Each card has its own layout, so the fields differ a little between the two. */
export default function FounderForm({ kind, values, action }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);
  const [uploading, setUploading] = useState(false);
  const isFounder = kind === "founder";

  return (
    <form action={formAction} onSubmit={(e) => submitWithoutReset(e, formAction)} className="space-y-6">
      <PhotoField
        initial={values.photo}
        help="A square, head-and-shoulders photo works best. Without one, the first letter of the name is shown."
        onUploadingChange={setUploading}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className="label">Role</label>
          <input id="role" name="role" type="text" required minLength={2} maxLength={80} defaultValue={values.role} className="field" />
        </div>
        <div>
          <label htmlFor="linkedin" className="label">LinkedIn link (optional)</label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            defaultValue={values.linkedin}
            placeholder="https://www.linkedin.com/in/…"
            className="field"
          />
        </div>
      </div>

      {!isFounder && (
        <>
          <div>
            <label htmlFor="headline" className="label">Headline (optional)</label>
            <input id="headline" name="headline" type="text" maxLength={160} defaultValue={values.headline} className="field" />
            <p className="mt-1.5 text-sm text-slate">The bold line under the name.</p>
          </div>
          <div>
            <label htmlFor="bio" className="label">About (optional)</label>
            <textarea id="bio" name="bio" maxLength={3000} rows={8} defaultValue={values.bio} className="field" />
            <p className="mt-1.5 text-sm text-slate">Leave an empty line between paragraphs.</p>
          </div>
        </>
      )}

      <div>
        <label htmlFor="tags" className="label">{isFounder ? "Titles (optional)" : "Areas of strength (optional)"}</label>
        <textarea id="tags" name="tags" maxLength={1500} rows={isFounder ? 8 : 5} defaultValue={values.tags} className="field" />
        <p className="mt-1.5 text-sm text-slate">One per line. Each one shows as a small tag.</p>
      </div>

      {isFounder && (
        <>
          <div>
            <label htmlFor="qualifications" className="label">Qualifications and certifications (optional)</label>
            <textarea id="qualifications" name="qualifications" maxLength={2000} rows={8} defaultValue={values.qualifications} className="field" />
            <p className="mt-1.5 text-sm text-slate">One per line.</p>
          </div>
          <div>
            <label htmlFor="alsoOffered" className="label">Also offered (optional)</label>
            <textarea id="alsoOffered" name="alsoOffered" maxLength={600} rows={3} defaultValue={values.alsoOffered} className="field" />
          </div>
        </>
      )}

      {state?.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending || uploading} className="btn btn-navy disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <Link href="/admin/team" className="font-semibold underline underline-offset-4">Cancel</Link>
      </div>
    </form>
  );
}
