import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import FaqItem from "@/components/FaqItem";
import HowWeWorkSteps from "@/components/HowWeWorkSteps";
import ReviewCarousel from "@/components/ReviewCarousel";
import SectionHeading from "@/components/SectionHeading";
import StarField from "@/components/StarField";
import { Icon } from "@/components/icons";
import MindOfLightHero from "@/components/mind-of-light/MindOfLightHero";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { faqs, home, services, whoWeServe, whyChoose } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { formatMonthYear, postCardDate } from "@/lib/text";

export const revalidate = 60;

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true, updatedAt: true },
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
      take: 12,
      select: { id: true, name: true, rating: true, message: true, approvedAt: true },
    });
  } catch {
    return [];
  }
}

const stats = [
  { value: "14", unit: "years", label: "Combined experience in psychology, counselling, assessments and training" },
  { value: "10+", unit: "years", label: "Specialised in workplace behaviour and seafarer mental health" },
  { value: "7", unit: "services", label: "From counselling and student programmes to PoSH and maritime psychology" },
];

export default async function HomePage() {
  const [posts, reviews] = await Promise.all([getLatestPosts(), getFeaturedReviews()]);

  return (
    <>
      {/* Hero: "Mind of Light" - a WebGL badge animation (galaxy -> vein brain -> logo) */}
      <MindOfLightHero>
        <h1 className="font-serif text-4xl leading-[1.1] text-white lg:text-[3.5rem]">{home.title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{home.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className="btn btn-gold">Explore our services</Link>
          <Link href="/contact" className="btn btn-outline-light">Book a session</Link>
        </div>
      </MindOfLightHero>

      {/* Credentials strip */}
      <section className="border-b border-line bg-white">
        <Stagger as="ul" className="mx-auto grid max-w-6xl divide-y divide-line px-6 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="flex items-center gap-4 py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <p className="font-serif text-5xl font-bold leading-none text-navy">
                {s.value}
                <span className="ml-1 text-base font-semibold text-brass">{s.unit}</span>
              </p>
              <p className="text-sm leading-snug text-slate">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Welcome */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:py-20 md:grid-cols-2 md:items-start">
        <SectionHeading kicker="Welcome" title={home.practiceTitle} intro={home.welcome} />
        <div>
          <FadeIn delay={0.1} className="space-y-5 text-lg leading-relaxed text-navy/85">
            {home.practice.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </FadeIn>
          <FadeIn delay={0.2}>
            <figure className="card mt-8 p-7">
              <p className="kicker text-brass">Our purpose</p>
              <blockquote className="mt-3 font-serif text-xl font-bold leading-snug text-navy">{home.purpose}</blockquote>
            </figure>
          </FadeIn>
        </div>
      </section>

      {/* Services at a glance */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading kicker="What we do" title="Our core services at a glance" />
            <FadeIn>
              <Link href="/services" className="btn btn-navy shrink-0">Explore our services</Link>
            </FadeIn>
          </div>
          {/* Seven services fill a 3-column grid exactly: the two flagship areas (counselling and maritime) span two columns */}
          <Stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              // Wide cards lay out side by side: name on the left, description and link on the right.
              // Counselling and maritime are wide on desktop; the last card is wide on tablets (2-column grid).
              const wide = s.slug === "counselling" || s.slug === "maritime";
              const tabletWide = i === services.length - 1;
              return (
                <StaggerItem key={s.slug} className={`h-full sm:last:col-span-2 lg:last:col-span-1 ${wide ? "lg:col-span-2" : ""}`}>
                  <Link
                    href={`/services#${s.slug}`}
                    className={`card card-hover group flex h-full flex-col p-7 ${wide ? "lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-10" : ""} ${
                      tabletWide ? "sm:max-lg:grid sm:max-lg:grid-cols-2 sm:max-lg:items-center sm:max-lg:gap-x-10" : ""
                    }`}
                  >
                    <div>
                      <span className="icon-badge transition-colors duration-200 group-hover:border-brass group-hover:bg-gold/15">
                        <Icon name={s.slug} />
                      </span>
                      <p className="text-sm font-semibold mt-6 text-slate">{s.audience}</p>
                      <h3 className="mt-2 font-serif text-xl leading-snug">{s.title}</h3>
                    </div>
                    <div
                      className={`flex flex-1 flex-col ${wide ? "lg:border-l lg:border-line lg:py-2 lg:pl-10" : ""} ${
                        tabletWide ? "sm:max-lg:border-l sm:max-lg:border-line sm:max-lg:py-2 sm:max-lg:pl-10" : ""
                      }`}
                    >
                      <p className={`mt-3 leading-relaxed text-navy/80 ${wide ? "lg:mt-0 lg:text-lg" : ""} ${tabletWide ? "sm:max-lg:mt-0" : ""}`}>
                        {s.summary}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brass">
                        Learn more
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Who we serve */}
      <section className="speckle relative overflow-hidden bg-navy text-white">
        <StarField />
        {/* Soft colour behind the cards so the frosted glass has something to blur */}
        <div aria-hidden className="pointer-events-none absolute left-[8%] top-[45%] h-80 w-80 rounded-full bg-gold/25 blur-[90px]" />
        <div aria-hidden className="pointer-events-none absolute right-[6%] top-[60%] h-96 w-96 rounded-full bg-[#3b5998]/40 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute left-[45%] top-[30%] h-64 w-64 rounded-full bg-deep-gold/15 blur-[90px]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeading
            kicker="Who we serve"
            title="From a first-year student to a seasoned CEO"
            intro="Whatever your age, role or industry, there is a place for you here."
            dark
          />
          <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {whoWeServe.map((w) => (
              <StaggerItem
                key={w.title}
                className="flex gap-4 rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.12] to-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors duration-300 hover:border-gold/60 hover:from-white/[0.18] hover:to-white/[0.06] sm:flex-col sm:gap-3"
              >
                <span className="shrink-0 text-gold">
                  <Icon name={w.icon} className="h-7 w-7" />
                </span>
                <span className="flex flex-col gap-1.5 sm:gap-3">
                  <span className="font-serif text-base font-bold leading-snug text-white">{w.title}</span>
                  <span className="text-sm leading-relaxed text-white/70">{w.body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why choose */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <SectionHeading kicker="Why choose Elevate HQ" title="Experience, ethics and real-world results" />
        <Stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((w) => (
            <StaggerItem key={w.text} className="h-full">
              {/* Same hover as the service cards; on an inner element so it doesn't fight the entrance animation */}
              <div className="card card-hover group flex h-full items-start gap-4 p-6">
                <span className="icon-badge !h-11 !w-11 transition-colors duration-200 group-hover:border-brass group-hover:bg-gold/15">
                  <Icon name={w.icon} className="h-5 w-5" />
                </span>
                <span className="pt-1 leading-relaxed text-navy/85">{w.text}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* How we work: a real sequence, so numbered */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <SectionHeading kicker="How we work" title="Five steps, built around you" center />
          <HowWeWorkSteps />
        </div>
      </section>

      {/* Promise */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:py-20 text-center">
        <FadeIn>
          <p className="kicker text-brass">Our promise</p>
          <p className="mt-5 font-serif text-3xl font-bold leading-snug text-navy sm:text-4xl">“{home.promise}”</p>
        </FadeIn>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16 lg:pb-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading kicker="From the blog" title="Notes on minds, work and wellbeing" />
            <FadeIn>
              <Link href="/blog" className="btn btn-navy shrink-0">All posts</Link>
            </FadeIn>
          </div>
          <Stagger as="ul" className="mt-10 grid gap-6 md:grid-cols-3">
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
                    <p className="text-sm text-slate">{postCardDate(p.publishedAt, p.updatedAt)}</p>
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
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading kicker="Testimonials" title="What clients say" />
              <FadeIn>
                <Link href="/reviews" className="btn btn-navy shrink-0">All reviews</Link>
              </FadeIn>
            </div>
            <FadeIn>
              <ReviewCarousel
                reviews={reviews.map((r) => ({
                  id: r.id,
                  name: r.name,
                  rating: r.rating,
                  message: r.message,
                  date: formatMonthYear(r.approvedAt),
                }))}
              />
            </FadeIn>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:py-20 md:grid-cols-[0.9fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHeading
              kicker="FAQ"
              title="Frequently asked questions"
              intro="Something else on your mind? Book a free introductory call and we will suggest the next step."
            />
            <FadeIn delay={0.15}>
              <Link href="/contact" className="btn btn-gold mt-8">Book a free call</Link>
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
