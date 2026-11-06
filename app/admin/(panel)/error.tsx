"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown inside the admin panel when a page or action fails (for example, the database is briefly
// unreachable, or a review was deleted in another tab before it was approved).
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-md border border-line bg-white p-8">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-slate">
        That did not go through. It is usually a brief connection problem, or the item was changed or deleted in
        another tab. Nothing else was affected.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-navy">
          Try again
        </button>
        <Link href="/admin" className="btn border border-line bg-white text-navy hover:border-brass">
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}
