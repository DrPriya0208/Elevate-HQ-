import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import HeroGlow from "@/components/HeroGlow";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "PoSH, psychometric assessment, counselling and training for organizations and individuals.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <HeroGlow />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <FadeIn>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
              PoSH, psychometric assessment, counselling and training.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Not sure which fits? Tell us what is going on and we will suggest a starting point.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <FadeIn>
          <nav aria-label="Jump to a service">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <a href={`#${s.slug}`} className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </FadeIn>

        <div className="mt-6 space-y-16">
          {services.map((s) => (
            <section key={s.slug} id={s.slug} className="scroll-mt-20">
              <FadeIn>
                <h2 className="font-serif text-3xl">{s.title}</h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-navy/90">{s.summary}</p>
                <Stagger as="ul" className="mt-6 list-disc space-y-2 pl-6">
                  {s.details.map((d) => (
                    <StaggerItem key={d} as="li" className="leading-relaxed text-navy/90">
                      {d}
                    </StaggerItem>
                  ))}
                </Stagger>
                <Link href="/contact" className="mt-6 inline-block font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
                  Enquire about {s.title.toLowerCase()}
                </Link>
              </FadeIn>
            </section>
          ))}
        </div>
      </div>

      <CtaBand />
    </>
  );
}
