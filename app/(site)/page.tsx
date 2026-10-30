import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import FaqItem from "@/components/FaqItem";
import SectionHeading from "@/components/SectionHeading";
import Stars from "@/components/Stars";
import { Icon } from "@/components/icons";
import MindOfLightHero from "@/components/mind-of-light/MindOfLightHero";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { clients, faqs, services, steps } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMonthYear } from "@/lib/text";

export const revalidate = 60;

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true },
    });
  } catch {
    return []; // the home page should still render if the database is unreachable
  }
}

async function getFeaturedReviews() {
  try {
    return await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: [{ featured: "desc" }, { approvedAt: "desc" }],
      take: 3,
      select: { id: true, name: true, rating: true, message: true, approvedAt: true },
    });
  } catch {
    return [];
  }
}

const stats = [
  { value: "14", unit: "years", label: "Combined experience in psychology, counselling and training" },
  { value: "10+", unit: "years", label: "Specialized in workplace behavior and seafarer wellbeing" },
  { value: "6", unit: "areas", label: "From PoSH compliance to private counselling" },
];

const clientIcons = ["building", "ship", "school", "briefcase", "person"];

export default async function HomePage() {
  const [posts, reviews] = await Promise.all([getLatestPosts(), getFeaturedReviews()]);

  return (
    <>
      {/* Hero: "Mind of Light" - a WebGL badge animation (galaxy -> vein brain -> logo) */}
      <MindOfLightHero>
        <h1 className="font-serif text-4xl leading-[1.1] text-white lg:text-[3.5rem]">
          Psychology for people and teams.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
          ElevateHQ offers counselling, psychometric assessment, PoSH compliance and leadership training, led by
          an organizational and maritime psychologist with 14 years of combined experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-gold">Book a session</Link>
          <Link href="/services" className="btn btn-outline-light">See our services</Link>
        </div>
      </MindOfLightHero>

      {/* Credentials strip */}
      <section className="border-b border-line bg-white">
        <Stagger as="ul" className="mx-auto grid max-w-6xl divide-y divide-line px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="flex items-center gap-4 py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="font-serif text-5xl font-bold leading-none text-navy">
                {s.value}
                <span className="ml-1 text-base font-semibold text-brass">{s.unit}</span>
              </p>
              <p className="text-sm leading-snug text-slate">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="What we do"
            title="Support for organizations, and for the individuals within them."
          />
          <FadeIn>
            <Link href="/services" className="btn btn-navy shrink-0">View all services</Link>
          </FadeIn>
        </div>
        <Stagger as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.slug} className="h-full">
              <Link href={`/services#${s.slug}`} className="card card-hover group flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="icon-badge transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <Icon name={s.slug} />
                  </span>
                  <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-slate">
                    {s.audience === "organizations" ? "Organizations" : "Individuals"}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-xl leading-snug">{s.title}</h3>
                <p className="mt-3 line-clamp-3 leading-relaxed text-navy/80">{s.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brass">
                  Learn more
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Who we work with */}
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading kicker="Who we work with" title="Organizations across sectors, and individuals too." dark />
          <Stagger as="ul" className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {clients.map((c, i) => (
              <StaggerItem
                key={c}
                className="flex flex-col items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-gold/50 hover:bg-white/[0.07]"
              >
                <span className="text-gold">
                  <Icon name={clientIcons[i] ?? "person"} className="h-7 w-7" />
                </span>
                <span className="font-serif text-lg leading-snug text-white">{c}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works: a real sequence, so numbered */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeading kicker="How it works" title="Three simple steps to get started." center />
          <div className="relative mt-16">
          <span aria-hidden className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 md:block" />
          <Stagger as="ol" className="relative grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={step.title} className="relative flex flex-col items-center px-4 text-center">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-white font-serif text-2xl font-bold text-navy shadow-[0_0_0_8px_white]">
                  {i + 1}
                </span>
                <h3 className="mt-6 font-serif text-xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-navy/80">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading kicker="From the blog" title="Notes on minds, work and wellbeing." />
            <FadeIn>
              <Link href="/blog" className="btn btn-navy shrink-0">All posts</Link>
            </FadeIn>
          </div>
          <Stagger as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <StaggerItem key={p.id} className="h-full">
                <Link href={`/blog/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="speckle flex h-full items-center justify-center">
                        <Image src="/elevatehq-logo-dark-playfair.svg" alt="" width={88} height={88} priority className="opacity-80" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm text-slate">{formatDate(p.publishedAt)}</p>
                    <h3 className="mt-2 font-serif text-xl leading-snug">{p.title}</h3>
                    <p className="mt-3 line-clamp-3 leading-relaxed text-navy/80">{p.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brass">
                      Read article
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* What clients say */}
      {reviews.length > 0 && (
        <section className="bg-mist">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading kicker="Testimonials" title="What clients say." />
              <FadeIn>
                <Link href="/reviews" className="btn btn-navy shrink-0">All reviews</Link>
              </FadeIn>
            </div>
            <Stagger as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
              {reviews.map((r) => (
                <StaggerItem key={r.id} className="card relative flex flex-col p-7">
                  <span aria-hidden className="absolute right-6 top-3 font-serif text-7xl leading-none text-gold/40">“</span>
                  <Stars rating={r.rating} />
                  <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed">{r.message}</p>
                  <p className="mt-auto pt-5 text-sm font-semibold text-navy">
                    {r.name}
                    <span className="font-normal text-slate"> · {formatMonthYear(r.approvedAt)}</span>
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[0.9fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHeading
              kicker="FAQ"
              title="Questions people ask first."
              intro="Something else on your mind? Message us and we will answer it directly."
            />
            <FadeIn delay={0.15}>
              <Link href="/contact" className="btn btn-gold mt-8">Ask a question</Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.1} className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </FadeIn>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
