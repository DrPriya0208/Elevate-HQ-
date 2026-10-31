"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitEnquiry } from "@/lib/actions";
import { motion, tapScale } from "@/components/motion";
import type { ContactState } from "@/lib/types";

const interests = [
  "PoSH compliance or training",
  "Organizational psychology or leadership training",
  "Maritime psychology",
  "Psychometric assessment",
  "Counselling (private session)",
  "Something else",
];

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitEnquiry, undefined);

  if (state?.ok) {
    return (
      <motion.div
        role="status"
        className="rounded-xl border border-gold bg-white p-6 shadow-[0_1px_3px_rgba(0,55,112,0.08)]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-serif text-2xl">Message received.</p>
        <p className="mt-2 text-slate">Thank you for getting in touch. We will reply to arrange a first conversation.</p>
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

      <div>
        <label htmlFor="name" className="label">Your name</label>
        <input id="name" name="name" type="text" required autoComplete="name" className="field" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="label">What would you like help with?</label>
        <select id="interest" name="interest" className="field" defaultValue={interests[0]}>
          {interests.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="organisation" className="label">Organization (optional)</label>
        <input id="organisation" name="organisation" type="text" maxLength={120} autoComplete="organization" className="field" />
      </div>

      <div>
        <label htmlFor="message" className="label">Message</label>
        <textarea id="message" name="message" required rows={6} className="field" />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={pending}
        className="btn btn-navy disabled:opacity-60"
        {...tapScale}
      >
        {pending ? "Sending…" : "Send message"}
      </motion.button>

      <p className="text-sm text-slate">
        By sending this form you agree to our{" "}
        <Link href="/privacy" className="font-semibold underline decoration-brass underline-offset-4 hover:text-navy">
          Privacy Policy
        </Link>
        . Please don&apos;t include clinical details here; we&apos;ll discuss them privately.
      </p>
    </form>
  );
}
