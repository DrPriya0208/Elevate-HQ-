"use client";

import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type Props = { action: () => Promise<void>; confirmText?: string; title?: string };

export default function DeleteButton({ action, confirmText = "Delete this post? This cannot be undone.", title = "Delete post?" }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [asking, setAsking] = useState(false);

  return (
    <form ref={formRef} action={action}>
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="text-sm font-semibold text-red-700 underline underline-offset-4 hover:text-red-900"
      >
        Delete
      </button>
      <ConfirmDialog
        open={asking}
        title={title}
        message={confirmText}
        confirmLabel="Delete"
        danger
        onCancel={() => setAsking(false)}
        onConfirm={() => {
          setAsking(false);
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
