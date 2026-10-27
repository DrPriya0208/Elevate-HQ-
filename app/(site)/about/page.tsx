import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import HeroGlow from "@/components/HeroGlow";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { certifications, founderProfile, poshRole, principles, qualifications, showPoshRole, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ElevateHQ and its founder, ${site.founder}.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <HeroGlow />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <FadeIn>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
              Psychology that blends scientific assessment, counselling insight and practical training.
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <Image
            src="/elevatehq-logo-dark-playfair.svg"
            width={320}
            height={320}
            alt="ElevateHQ logo"
            className="h-auto w-56 ring-1 ring-line md:w-72"
          />
        </FadeIn>
        <FadeIn delay={0.1} className="max-w-2xl space-y-5">
          <p className="font-serif text-[1.15rem] leading-[1.8]">
            ElevateHQ is led by {site.founder}, {founderProfile.headline}, based in {site.location}.
          </p>
          <p className="font-serif text-[1.15rem] leading-[1.8]">{founderProfile.experience}</p>
          <p className="font-serif text-[1.15rem] leading-[1.8]">{founderProfile.doctorate}</p>
          {showPoshRole && <p className="font-serif text-[1.15rem] leading-[1.8]">{poshRole}</p>}

          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile, opens in a new tab"
            className="inline-block font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy"
          >
            LinkedIn profile
          </a>

          {qualifications.length > 0 && (
            <div className="pt-4">
              <h2 className="font-serif text-2xl">Qualifications</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-6">
                {qualifications.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="pt-2">
              <h2 className="font-serif text-2xl">Certifications</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-6">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </FadeIn>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn><h2 className="font-serif text-3xl sm:text-4xl">How we work</h2></FadeIn>
          <Stagger as="ul" className="mt-10 grid gap-10 md:grid-cols-3">
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <h3 className="font-serif text-xl">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-navy/90">{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
