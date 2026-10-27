"use client";

export default function ActionButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <form action={action}>
      <button type="submit" className="text-sm font-semibold underline underline-offset-4 hover:text-brass">
        {label}
      </button>
    </form>
  );
}
