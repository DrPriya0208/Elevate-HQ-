"use client";

import { useState } from "react";

/**
 * Wraps a long team list. Items past the limit carry `hidden group-data-[expanded=true]/board:flex`: they stay in the
 * HTML for search engines, but are hidden from everyone, screen readers included, until the button is pressed.
 * The button says how many people there are and carries aria-expanded / aria-controls.
 */
export default function ShowMore({
  total,
  limit,
  phoneLimit,
  listId,
  children,
}: {
  total: number;
  /** Shown at first on tablets and up */
  limit: number;
  /** Shown at first on phones */
  phoneLimit: number;
  listId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // The button is needed on every screen when the wide limit hides people, otherwise only on phones
  const needed = total > limit ? "" : total > phoneLimit ? "sm:hidden" : null;
  return (
    <div data-expanded={open} className="group/board">
      {children}
      {needed !== null && (
        <div className={`mt-12 text-center ${needed}`}>
          <button type="button" className="btn btn-navy" aria-controls={listId} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Show fewer" : `Meet all ${total} people`}
          </button>
        </div>
      )}
    </div>
  );
}
