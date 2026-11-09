import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import CoverImage from "@/components/CoverImage";
import CtaBand from "@/components/CtaBand";
import { getActiveTeam, qualificationList } from "@/lib/team";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@/components/icons";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { about, coFounder, founder, site, values } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `About Elevate HQ, its founder ${founder.name} and co-founder ${coFounder.name}.`,
  path: "/about",
});

function Monogram({ name }: { name: string }) {
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-2xl font-semibold text-gold ring-4 ring-gold/25">
      {name.charAt(0)}
    </span>
  );
}

// Rebuilt at most hourly; adding, editing or hiding a team member in the admin refreshes it at once
export const revalidate = 3600;

export default async function AboutPage() {
  const team = await getActiveTeam();
  return (
    <>
      <PageHero kicker="About Elevate HQ" title={about.title} intro={about.storyBelief} />

      {/* Story */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:py-20 md:grid-cols-[0.85fr_1.15fr]">
        <FadeIn className="md:sticky md:top-28 md:self-start">
          <div className="card relative overflow-hidden p-10">
            <Image
              src="/elevatehq-logo-dark-playfair.svg"
              width={320}
              height={320}
              alt="Elevate HQ logo"
              priority
              className="relative mx-auto h-auto w-full max-w-[18rem]"
            />
          </div>
        </FadeIn>

        <div>
          <SectionHeading kicker="Our story" title="Every person deserves to feel mentally strong" />
          <FadeIn delay={0.1} className="mt-8 space-y-5">
            {about.story.map((p) => (
              <p key={p} className="font-serif text-[1.15rem] leading-[1.8]">
                {p}
              </p>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="mx-auto max-w-6xl px-6 pb-16 lg:pb-20">
        <Stagger as="div" className="grid gap-6 md:grid-cols-2">
          <StaggerItem as="div" className="speckle relative overflow-hidden rounded-xl bg-navy p-8 text-white md:p-10">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold">
              <Icon name="compass" />
            </span>
            <p className="kicker relative mt-6 text-gold">Our mission</p>
            <p className="relative mt-3 font-serif text-2xl font-semibold leading-snug">{about.mission}</p>
          </StaggerItem>
          <StaggerItem as="div" className="card relative overflow-hidden p-8 md:p-10">
            <span className="icon-badge">
              <Icon name="sun" />
            </span>
            <p className="kicker mt-6 text-brass">Our vision</p>
            <p className="mt-3 font-serif text-2xl font-semibold leading-snug text-navy">{about.vision}</p>
          </StaggerItem>
        </Stagger>
      </section>

      {/* Values */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeading
            kicker="Our values"
            title="E-L-E-V-A-T-E H-Q"
            intro="The values behind our name, and behind every session, assessment and programme."
            center
          />
          <Stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <StaggerItem key={`${v.letter}-${i}`} className="card card-hover flex items-start gap-5 p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy font-serif text-3xl font-semibold text-gold">
                  {v.letter}
                </span>
                <span>
                  <span className="block font-serif text-lg font-semibold text-navy">{v.title}</span>
                  <span className="mt-1 block leading-relaxed text-navy/75">{v.body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <SectionHeading kicker="Our team" title="Science and compassion, strategy and reach" center />
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          <FadeIn className="card flex flex-col p-8 md:p-10">
            <div className="flex items-center gap-5">
              <Monogram name={founder.name} />
              <div>
                <p className="text-sm font-semibold text-brass">{founder.role}</p>
                <h3 className="mt-1 font-serif text-2xl">{founder.name}</h3>
              </div>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {founder.titles.map((t) => (
                <li key={t} className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-navy">
                  {t}
                </li>
              ))}
            </ul>
            <p className="kicker mt-8 text-brass">Qualifications and certifications</p>
            <ul className="mt-4 space-y-2.5">
              {founder.qualifications.map((q) => (
                <li key={q} className="flex gap-3 leading-relaxed text-navy/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-brass">
                    <Icon name="award" className="h-3.5 w-3.5" />
                  </span>
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-mist p-4 text-[0.95rem] leading-relaxed text-navy/85">
              <span className="font-semibold text-navy">Also offered: </span>
              {founder.alsoOffered}
            </p>
            <div className="mt-auto pt-8">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name}'s LinkedIn profile, opens in a new tab`}
                className="btn btn-navy"
              >
                LinkedIn profile
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="card flex flex-col p-8 md:p-10">
            <div className="flex items-center gap-5">
              <Monogram name={coFounder.name} />
              <div>
                <p className="text-sm font-semibold text-brass">{coFounder.role}</p>
                <h3 className="mt-1 font-serif text-2xl">{coFounder.name}</h3>
              </div>
            </div>
            <p className="mt-6 font-semibold text-navy">{coFounder.headline}</p>
            <div className="mt-4 space-y-4 leading-relaxed text-navy/85">
              {coFounder.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="kicker mt-8 text-brass">Areas of strength</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {coFounder.strengths.map((s) => (
                <li key={s} className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-navy">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <a
                href={coFounder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${coFounder.name}'s LinkedIn profile, opens in a new tab`}
                className="btn btn-navy"
              >
                LinkedIn profile
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Wider team, managed in /admin/team. Hidden entirely until a member is shown. */}
        {team.length > 0 && (
          <div className="mt-16">
            <h3 className="text-center font-serif text-2xl md:text-3xl">The people you will work with</h3>
            {/* Centred rows, so one or two members do not leave an empty gap on the right */}
            <Stagger as="ul" className="mt-10 flex flex-wrap justify-center gap-6">
              {team.map((m) => {
                const qualifications = qualificationList(m);
                return (
                  <StaggerItem
                    key={m.id}
                    className="card flex w-full flex-col p-6 sm:w-[calc((100%-1.5rem)/2)] md:p-8 lg:w-[calc((100%-3rem)/3)]"
                  >
                    <div className="flex items-center gap-4">
                      {m.photo ? (
                        <CoverImage
                          src={m.photo}
                          alt={`Photo of ${m.name}`}
                          sizes="64px"
                          className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-gold/25"
                        />
                      ) : (
                        <Monogram name={m.name} />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brass">{m.role}</p>
                        <p className="mt-1 font-serif text-xl font-semibold text-navy">{m.name}</p>
                      </div>
                    </div>
                    <p className="mt-5 whitespace-pre-line leading-relaxed text-navy/85">{m.bio}</p>
                    {qualifications.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {qualifications.map((q) => (
                          <li key={q} className="flex gap-3 text-[0.95rem] leading-relaxed text-navy/85">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-brass">
                              <Icon name="award" className="h-3.5 w-3.5" />
                            </span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.languages && (
                      <p className="mt-5 text-sm text-slate">
                        <span className="font-semibold text-navy">Languages: </span>
                        {m.languages}
                      </p>
                    )}
                    {m.linkedin && (
                      <div className="mt-auto pt-6">
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name}'s LinkedIn profile, opens in a new tab`}
                          className="font-semibold text-navy underline decoration-brass underline-offset-4 hover:text-brass"
                        >
                          LinkedIn profile
                        </a>
                      </div>
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        )}
      </section>

      <CtaBand />
    </>
  );
}
