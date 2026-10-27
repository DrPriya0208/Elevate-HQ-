import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import FaqItem from "@/components/FaqItem";
import Stars from "@/components/Stars";
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
      select: { id: true, slug: true, title: true, excerpt: true, publishedAt: true },
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

export default async function HomePage() {
  const [posts, reviews] = await Promise.all([getLatestPosts(), getFeaturedReviews()]);
  const organizations = services.filter((s) => s.audience === "organizations");
  const individuals = services.filter((s) => s.audience === "individuals");

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

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn>
          <h2 className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
            Support for organizations, and for the individuals within them.
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="font-serif text-2xl">For organizations</h3>
            <Stagger as="ul" className="mt-5">
              {organizations.map((s) => (
                <StaggerItem key={s.slug} className="py-4">
                  <p className="font-serif text-xl font-bold">{s.title}</p>
                  <p className="mt-1.5 leading-relaxed text-navy/90">{s.summary}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <h3 className="font-serif text-2xl">For individuals</h3>
            <Stagger as="ul" className="mt-5">
              {individuals.map((s) => (
                <StaggerItem key={s.slug} className="py-4">
                  <p className="font-serif text-xl font-bold">{s.title}</p>
                  <p className="mt-1.5 leading-relaxed text-navy/90">{s.summary}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Link href="/services" className="mt-4 inline-block font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <FadeIn><h2 className="font-serif text-3xl sm:text-4xl">Who we work with</h2></FadeIn>
        <Stagger as="ul" className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {clients.map((c) => (
            <StaggerItem key={c} className="font-serif text-xl">
              {c}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* How it works: a real sequence, so numbered */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn><h2 className="font-serif text-3xl sm:text-4xl">How it works</h2></FadeIn>
          <Stagger as="ol" className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <p className="font-serif text-5xl leading-none text-brass" aria-hidden="true">{i + 1}</p>
                <h3 className="mt-4 font-serif text-xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-navy/90">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl">From the blog</h2>
            <Link href="/blog" className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
              All posts
            </Link>
          </FadeIn>
          <Stagger as="ul" className="mt-8 space-y-10">
            {posts.map((p) => (
              <StaggerItem key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <p className="text-sm text-slate">{formatDate(p.publishedAt)}</p>
                  <p className="mt-1 font-serif text-2xl font-bold group-hover:underline group-hover:decoration-brass group-hover:underline-offset-4">
                    {p.title}
                  </p>
                  <p className="mt-2 max-w-2xl leading-relaxed text-navy/90">{p.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* What clients say */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <FadeIn className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl">What clients say</h2>
            <Link href="/reviews" className="font-semibold underline decoration-brass underline-offset-4 hover:decoration-navy">
              All reviews
            </Link>
          </FadeIn>
          <Stagger as="ul" className="mt-8 space-y-10">
            {reviews.map((r) => (
              <StaggerItem key={r.id}>
                <Stars rating={r.rating} />
                <p className="mt-3 max-w-2xl whitespace-pre-line font-serif text-xl leading-relaxed">{r.message}</p>
                <p className="mt-3 text-sm text-slate">
                  {r.name} · {formatMonthYear(r.approvedAt)}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <FadeIn><h2 className="font-serif text-3xl sm:text-4xl">Questions people ask first</h2></FadeIn>
          <FadeIn delay={0.1} className="mt-8 space-y-6">
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
