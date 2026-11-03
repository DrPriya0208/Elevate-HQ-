"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** A modal "are you sure?" box built on the native <dialog>, so Esc, focus trapping and screen readers work. */
export default function ConfirmDialog({ open, title, message, confirmLabel, danger = false, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      onClick={(e) => e.target === ref.current && onCancel()} // click on the backdrop
      aria-labelledby="confirm-title"
      className="w-[min(28rem,calc(100%-2rem))] rounded-xl border border-line bg-white p-0 text-navy shadow-[0_20px_50px_rgba(10,21,48,0.3)] backdrop:bg-ink/60"
    >
      <div className="p-7">
        <h2 id="confirm-title" className="font-serif text-2xl">{title}</h2>
        <p className="mt-3 leading-relaxed text-slate">{message}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} autoFocus className="btn border border-line bg-white text-navy hover:border-navy">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={danger ? "btn bg-red-700 text-white hover:bg-red-800" : "btn btn-navy"}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
