"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/uploadImage";

/**
 * A round profile photo with Upload / Replace / Remove. The photo's link is sent as the hidden field `photo`.
 * `onUploadingChange` lets the form disable its save button while an upload is in progress.
 */
export default function PhotoField({
  initial,
  help,
  onUploadingChange,
}: {
  initial: string;
  help: string;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [photo, setPhoto] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    onUploadingChange?.(true);
    try {
      setPhoto(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload the photo.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div>
      <p className="label">Photo (optional)</p>
      <div className="flex flex-wrap items-center gap-4">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-gold/25" />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-center text-xs leading-tight text-gold/80 ring-4 ring-gold/25">
            No photo
          </span>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn btn-navy !px-4 !py-2 text-sm disabled:opacity-60"
        >
          {uploading ? "Uploading…" : photo ? "Replace photo" : "Upload photo"}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => setPhoto("")}
            className="text-sm font-semibold text-slate underline underline-offset-4 hover:text-navy"
          >
            Remove
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <input type="hidden" name="photo" value={photo} />
      <p className="mt-1.5 text-sm text-slate">{help}</p>
      {error && <p className="mt-1 text-sm text-red-800">{error}</p>}
    </div>
  );
}
