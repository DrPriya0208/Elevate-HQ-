import type { Metadata } from "next";
import HeroGlow from "@/components/HeroGlow";
import { site } from "@/lib/content";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a session or ask a question. ElevateHQ, Sholinganallur, Chennai.",
};

export default function ContactPage() {
  return (
    <>
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <HeroGlow />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h1 className="font-serif text-4xl text-white sm:text-5xl">Book a session</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Send a message and we will reply to arrange a first conversation.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <ContactForm />

        <aside className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl">Prefer to call or message?</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={site.phoneHref} className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy"
                >
                  Message on WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="break-all font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Where we are</h2>
            <p className="mt-3 text-slate">{site.location}</p>
          </div>
          <p className="rounded-md border border-line bg-white p-4 text-sm leading-relaxed text-slate">
            This form is not monitored around the clock. In a crisis, call Tele-MANAS on 14416 or 1-800-891-4416, or go
            to the nearest hospital.
          </p>
        </aside>
      </div>
    </>
  );
}
