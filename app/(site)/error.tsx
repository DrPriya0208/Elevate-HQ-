"use client";

import Link from "next/link";
import { useEffect } from "react";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/content";

// Shown inside the site layout when a page fails to load (for example, the database is briefly unreachable).
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <PageHero
        kicker="Something went wrong"
        title="This page could not be loaded"
        intro="It is usually a brief connection problem on our side. Please try again in a moment."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-gold">
            Try again
          </button>
          <Link href="/" className="btn btn-outline-light">
            Back to home
          </Link>
        </div>
      </PageHero>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="max-w-2xl leading-relaxed text-navy/85">
          Need to reach us now? Call{" "}
          <a href={site.phoneHref} className="font-semibold underline decoration-brass underline-offset-4">
            {site.phone}
          </a>{" "}
          or{" "}
          <a href={site.whatsapp} className="font-semibold underline decoration-brass underline-offset-4" target="_blank" rel="noopener noreferrer">
            message us on WhatsApp
          </a>
          .
        </p>
      </section>
    </>
  );
}
