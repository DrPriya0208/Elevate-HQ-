"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormState } from "@/lib/types";
import Editor from "./Editor";

type PostValues = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  published: boolean;
};

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  post?: PostValues;
  submitLabel: string;
};

export default function PostForm({ action, post, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);
  const [content, setContent] = useState(post?.content ?? "");

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">Title</label>
        <input id="title" name="title" type="text" required defaultValue={post?.title} className="field" />
      </div>

      <div>
        <p className="label">Content</p>
        <Editor value={content} onChange={setContent} />
        <input type="hidden" name="content" value={content} />
      </div>

      <div>
        <label htmlFor="excerpt" className="label">Summary (optional)</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          className="field"
          placeholder="Shown on the blog list. Leave empty to use the start of the post."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="label">Web address (optional)</label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={post?.slug}
            className="field"
            placeholder="created from the title if empty"
          />
        </div>
        <div>
          <label htmlFor="coverImage" className="label">Cover image link (optional)</label>
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            defaultValue={post?.coverImage}
            className="field"
            placeholder="https://…"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" name="published" defaultChecked={post?.published} className="h-5 w-5 accent-navy" />
        <span className="font-semibold">Published (visible on the website)</span>
      </label>

      {state?.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className="btn btn-navy disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin" className="font-semibold underline underline-offset-4">Cancel</Link>
      </div>
    </form>
  );
}
