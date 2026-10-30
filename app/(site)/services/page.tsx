import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import { Icon } from "@/components/icons";
import { DrawLine, FadeIn, RevealText, ScaleIn, Stagger, StaggerItem } from "@/components/motion";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "PoSH, psychometric assessment, counselling and training for organizations and individuals.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Our services"
        title="PoSH, psychometric assessment, counselling and training."
        intro="Not sure which fits? Tell us what is going on and we will suggest a starting point."
      />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <StaggerItem key={s.slug} className="h-full">
              <a href={`#${s.slug}`} className="card card-hover group flex h-full flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="icon-badge transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <Icon name={s.slug} />
                  </span>
                  <span className="font-serif text-sm text-slate">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="mt-2 font-serif text-lg font-bold leading-snug text-navy">{s.title}</span>
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
              <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                <div className="speckle relative overflow-hidden bg-navy p-8 text-white md:p-10">
                  <div aria-hidden className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <ScaleIn className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                        <Icon name={s.slug} />
                      </ScaleIn>
                      <span className="font-serif text-4xl font-bold text-white/15">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="kicker mt-8 text-gold">
                      {s.audience === "organizations" ? "For organizations" : "For individuals"}
                    </p>
                    <RevealText
                      as="h2"
                      text={s.title}
                      className="mt-3 font-serif text-3xl leading-tight text-white"
                    />
                    <DrawLine className="mt-5 block h-[3px] w-16 origin-left rounded-full bg-gold" />
                    <FadeIn delay={0.1}>
                      <p className="mt-6 leading-relaxed text-white/80">{s.summary}</p>
                    </FadeIn>
                  </div>
                </div>

                <div className="flex flex-col p-8 md:p-10">
                  <p className="kicker text-brass">What&apos;s included</p>
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
                  <div className="mt-auto pt-8">
                    <Link href="/contact" className="btn btn-navy">
                      Enquire about this
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <CtaBand />
    </>
  );
}
