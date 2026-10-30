import Link from "next/link";
import { site } from "@/lib/content";
import { DrawLine, FadeIn, RevealText } from "@/components/motion";

export default function CtaBand() {
  return (
    <section className="bg-mist px-6 py-20">
      <div className="speckle relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-navy text-white shadow-[0_24px_60px_rgba(10,21,48,0.25)]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="animate-drift absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-deep-gold/10 blur-3xl" style={{ animationDelay: "-6s" }} />
        </div>
        <div className="relative flex flex-col items-start gap-8 px-8 py-14 md:flex-row md:items-center md:justify-between md:px-14">
          <div className="max-w-xl">
            <p className="kicker text-gold">Let&apos;s talk</p>
            <RevealText as="h2" text="Ready to talk it through?" className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl" />
            <DrawLine className="mt-5 block h-[3px] w-16 origin-left rounded-full bg-gold" />
            <FadeIn delay={0.1}>
              <p className="mt-5 text-white/80">
                Send a message and we will get back to you to arrange a first conversation.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15} className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-gold">Book a session</Link>
            <a href={site.whatsapp} className="btn btn-outline-light" target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
