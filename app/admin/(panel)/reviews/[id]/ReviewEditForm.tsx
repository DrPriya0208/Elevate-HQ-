"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitWithoutReset } from "@/lib/submitWithoutReset";
import type { FormState } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  name: string;
  message: string;
};

export default function ReviewEditForm({ action, name, message }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);

  return (
    <form action={formAction} onSubmit={(e) => submitWithoutReset(e, formAction)} className="space-y-6">
      <div>
        <label htmlFor="name" className="label">Display name</label>
        <input id="name" name="name" type="text" maxLength={60} defaultValue={name} className="field" />
      </div>

      <div>
        <label htmlFor="message" className="label">Message</label>
        <textarea id="message" name="message" required minLength={20} maxLength={800} rows={8} defaultValue={message} className="field" />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className="btn btn-navy disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <Link href="/admin/reviews" className="font-semibold underline underline-offset-4">Cancel</Link>
      </div>
    </form>
  );
}
