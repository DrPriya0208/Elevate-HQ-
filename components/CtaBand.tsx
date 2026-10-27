import Link from "next/link";
import { site } from "@/lib/content";
import { FadeIn } from "@/components/motion";

export default function CtaBand() {
  return (
    <section className="speckle relative overflow-hidden bg-navy text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      </div>
      <FadeIn className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl">Ready to talk it through?</h2>
          <p className="mt-3 text-white/80">
            Send a message and we will get back to you to arrange a first conversation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-gold">Book a session</Link>
          <a href={site.whatsapp} className="btn btn-outline-light" target="_blank" rel="noopener noreferrer">
            Message on WhatsApp
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
