import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@/components/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { certifications, founderProfile, poshRole, principles, qualifications, showPoshRole, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ElevateHQ and its founder, ${site.founder}.`,
};

const principleIcons = ["ear", "compass", "lock"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About ElevateHQ"
        title="Psychology that blends scientific assessment, counselling insight and practical training."
      />

      {/* Founder */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-[0.85fr_1.15fr]">
        <FadeIn className="md:sticky md:top-28 md:self-start">
          <div className="card relative overflow-hidden p-10">
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-2xl" />
            <Image
              src="/elevatehq-logo-dark-playfair.svg"
              width={320}
              height={320}
              alt="ElevateHQ logo"
              priority
              className="relative mx-auto h-auto w-full max-w-[18rem]"
            />
          </div>
          <div className="mt-5 rounded-xl bg-navy p-6 text-white">
            <p className="kicker text-gold">Founder</p>
            <p className="mt-2 font-serif text-2xl font-bold">{site.founder}</p>
            <p className="mt-1 text-sm leading-relaxed text-white/75">{founderProfile.headline}</p>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile, opens in a new tab"
              className="btn btn-gold mt-5 !px-5 !py-2 text-sm"
            >
              LinkedIn profile
            </a>
          </div>
        </FadeIn>

        <div>
          <SectionHeading kicker="Our story" title={`Led by ${site.founder}, based in ${site.location}.`} />
          <FadeIn delay={0.1} className="mt-8 space-y-5">
            <p className="font-serif text-[1.15rem] leading-[1.8]">{founderProfile.experience}</p>
            <p className="font-serif text-[1.15rem] leading-[1.8]">{founderProfile.doctorate}</p>
            {showPoshRole && <p className="font-serif text-[1.15rem] leading-[1.8]">{poshRole}</p>}
          </FadeIn>

          {qualifications.length > 0 && (
            <div className="mt-14">
              <FadeIn>
                <h3 className="font-serif text-2xl">Qualifications</h3>
              </FadeIn>
              <Stagger as="ul" className="mt-5 space-y-3">
                {qualifications.map((q) => (
                  <StaggerItem key={q} className="card flex items-start gap-4 p-5">
                    <span className="icon-badge !h-10 !w-10">
                      <Icon name="book" className="h-5 w-5" />
                    </span>
                    <span className="pt-2 leading-relaxed">{q}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="mt-12">
              <FadeIn>
                <h3 className="font-serif text-2xl">Certifications</h3>
              </FadeIn>
              <Stagger as="ul" className="mt-5 grid gap-3 sm:grid-cols-2">
                {certifications.map((c) => (
                  <StaggerItem key={c} className="card flex items-center gap-3 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-brass">
                      <Icon name="award" className="h-4 w-4" />
                    </span>
                    <span className="text-[0.95rem] font-medium leading-snug">{c}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeading kicker="Our approach" title="How we work." center />
          <Stagger as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
            {principles.map((p, i) => (
              <StaggerItem key={p.title} className="card card-hover p-8">
                <span className="icon-badge">
                  <Icon name={principleIcons[i] ?? "check"} />
                </span>
                <h3 className="mt-6 font-serif text-xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-navy/80">{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
