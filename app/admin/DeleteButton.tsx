"use client";

type Props = { action: () => Promise<void>; confirmText?: string };

export default function DeleteButton({ action, confirmText = "Delete this post? This cannot be undone." }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-sm font-semibold text-red-700 underline underline-offset-4 hover:text-red-900">
        Delete
      </button>
    </form>
  );
}
