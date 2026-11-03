"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import type { FormState } from "@/lib/types";
import ConfirmDialog from "./ConfirmDialog";
import Editor from "./Editor";
import { uploadImage } from "./uploadImage";

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
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmed = useRef(false);
  const [asking, setAsking] = useState<null | { published: boolean }>(null);

  // Ask before saving; the confirm button re-submits the form with `confirmed` set
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (confirmed.current) {
      confirmed.current = false;
      return;
    }
    e.preventDefault();
    const published = (e.currentTarget.elements.namedItem("published") as HTMLInputElement).checked;
    setAsking({ published });
  }

  const editing = Boolean(post);
  const dialog = asking && {
    title: editing ? "Save changes?" : asking.published ? "Publish this post?" : "Save as draft?",
    message: asking.published
      ? editing
        ? post?.published
          ? "Your changes will go live on the website straight away."
          : "This post will be published and visible on the website straight away."
        : "It will be visible on the website straight away."
      : editing && post?.published
        ? "This post will be unpublished and hidden from the website until you publish it again."
        : "It will be saved but not shown on the website until you publish it.",
    confirmLabel: editing ? "Save changes" : asking.published ? "Publish" : "Save draft",
  };

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setCoverError(null);
    setCoverUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : "Could not upload the image.");
    } finally {
      setCoverUploading(false);
    }
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-6">
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
          <label htmlFor="coverImage" className="label">Cover image (optional)</label>
          <div className="flex flex-wrap items-center gap-3">
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="" className="h-16 w-24 rounded-md object-cover" />
            )}
            <button
              type="button"
              onClick={() => coverFileRef.current?.click()}
              disabled={coverUploading}
              className="btn btn-navy !px-4 !py-2 text-sm disabled:opacity-60"
            >
              {coverUploading ? "Uploading…" : coverImage ? "Replace photo" : "Upload photo"}
            </button>
            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="text-sm font-semibold text-slate underline underline-offset-4 hover:text-navy"
              >
                Remove
              </button>
            )}
            <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
          </div>
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="field mt-2"
            placeholder="or paste an image link (https://…)"
          />
          {coverError && <p className="mt-1 text-sm text-red-800">{coverError}</p>}
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

      <ConfirmDialog
        open={Boolean(dialog)}
        title={dialog ? dialog.title : ""}
        message={dialog ? dialog.message : ""}
        confirmLabel={dialog ? dialog.confirmLabel : ""}
        onCancel={() => setAsking(null)}
        onConfirm={() => {
          setAsking(null);
          confirmed.current = true;
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
