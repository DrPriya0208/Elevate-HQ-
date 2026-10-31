"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitReview } from "@/lib/actions";
import { motion, tapScale } from "@/components/motion";
import { reviewsCopy } from "@/lib/content";
import type { ReviewState } from "@/lib/types";

const ratingLabels = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];

function RatingInput() {
  return (
    <fieldset>
      <legend className="label">Your rating</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-3xl leading-none text-line has-[:checked]:text-deep-gold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy"
          >
            <input type="radio" name="rating" value={n} required className="peer sr-only" />
            <span aria-hidden="true" className="peer-checked:text-deep-gold">★</span>
            <span className="sr-only">{ratingLabels[n - 1]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ReviewForm() {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, undefined);
  const [renderedAt] = useState(() => Date.now());

  if (state?.ok) {
    return (
      <motion.div
        role="status"
        className="rounded-xl border border-gold bg-white p-6 shadow-[0_1px_3px_rgba(0,55,112,0.08)]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-serif text-2xl">Thank you.</p>
        <p className="mt-2 text-slate">{reviewsCopy.success}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* Honeypot: hidden from people, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <RatingInput />

      <div>
        <label htmlFor="name" className="label">Your name (optional)</label>
        <input id="name" name="name" type="text" maxLength={60} autoComplete="name" className="field" />
        <p className="mt-1.5 text-sm text-slate">{reviewsCopy.helper}</p>
      </div>

      <div>
        <label htmlFor="message" className="label">Your feedback</label>
        <textarea id="message" name="message" required minLength={20} maxLength={800} rows={6} className="field" />
      </div>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 accent-navy" />
        <span>
          {reviewsCopy.consent} See our{" "}
          <Link href="/privacy" className="font-semibold underline decoration-brass underline-offset-4 hover:text-navy">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <motion.button type="submit" disabled={pending} className="btn btn-navy disabled:opacity-60" {...tapScale}>
        {pending ? "Sending…" : "Send feedback"}
      </motion.button>
    </form>
  );
}
