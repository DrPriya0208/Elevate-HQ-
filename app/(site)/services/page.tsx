import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@/components/icons";
import { DrawLine, FadeIn, RevealText, ScaleIn, Stagger, StaggerItem } from "@/components/motion";
import { services, whoChoosesUs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Counselling, psychometric assessments, leadership and soft skills training, PoSH compliance, organisational and maritime psychology, and student programmes.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Our services"
        title="Psychology, counselling, assessments and training."
        intro="Not sure which fits? Book a free introductory call and we will suggest a starting point."
      />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <StaggerItem key={s.slug} className="h-full">
              <a href={`#${s.slug}`} className="card card-hover group flex h-full flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="icon-badge transition-colors duration-200 group-hover:border-brass group-hover:bg-gold/15">
                    <Icon name={s.slug} />
                  </span>
                  <span className="font-serif text-sm text-slate">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="mt-2 font-serif text-lg font-bold leading-snug text-navy">{s.title}</span>
                <span className="text-sm leading-relaxed text-navy/75">{s.summary}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brass">
                  Learn more
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-24 space-y-8">
          {services.map((s, i) => (
            <section key={s.slug} id={s.slug} className="card scroll-mt-28 overflow-hidden">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="speckle relative overflow-hidden bg-navy p-8 text-white md:p-10">
                  <div aria-hidden className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <ScaleIn className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                        <Icon name={s.slug} />
                      </ScaleIn>
                      <span className="font-serif text-4xl font-bold text-white/15">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="kicker mt-8 text-gold">{s.audience}</p>
                    <RevealText as="h2" text={s.title} className="mt-3 font-serif text-3xl leading-tight text-white" />
                    <DrawLine className="mt-5 block h-[3px] w-16 origin-left rounded-full bg-gold" />
                    <FadeIn delay={0.1} className="mt-6 space-y-4 leading-relaxed text-white/80">
                      {s.intro.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </FadeIn>
                  </div>
                </div>

                <div className="flex flex-col p-8 md:p-10">
                  <p className="kicker text-brass">{s.listTitle}</p>
                  <Stagger as="ul" className="mt-5 space-y-3">
                    {s.details.map((d) => (
                      <StaggerItem key={d} className="flex gap-3 leading-relaxed text-navy/90">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-brass">
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        {d}
                      </StaggerItem>
                    ))}
                  </Stagger>

                  {s.steps && (
                    <FadeIn className="mt-8">
                      <p className="kicker text-brass">{s.steps.title}</p>
                      <ol className="mt-4 space-y-3">
                        {s.steps.items.map((step, n) => (
                          <li key={step} className="flex gap-3 leading-relaxed text-navy/90">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">
                              {n + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </FadeIn>
                  )}

                  {s.notes && (
                    <FadeIn className="mt-8 space-y-3">
                      {s.notes.map((note) => (
                        <p key={note.label} className="rounded-xl bg-mist p-4 text-[0.95rem] leading-relaxed text-navy/85">
                          <span className="font-semibold text-navy">{note.label}: </span>
                          {note.text}
                        </p>
                      ))}
                    </FadeIn>
                  )}

                  <div className="mt-auto pt-8">
                    <Link href={`/contact?topic=${encodeURIComponent(s.topic)}`} className="btn btn-navy">
                      {s.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-24">
          <SectionHeading kicker="Who chooses us" title="Trusted by people and organisations of every kind." center />
          <Stagger as="ul" className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {whoChoosesUs.map((w) => (
              <StaggerItem key={w} className="rounded-full border border-line bg-white px-5 py-2.5 text-[0.95rem] font-medium text-navy">
                {w}
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </div>

      <CtaBand />
    </>
  );
}
