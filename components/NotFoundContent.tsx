import Link from "next/link";
import PageHero from "@/components/PageHero";

const places = [
  { href: "/about", label: "About us", note: "Who we are and how we work" },
  { href: "/blog", label: "Blog", note: "Notes on minds, work and wellbeing" },
  { href: "/reviews", label: "Reviews", note: "What clients say" },
];

/** Shared body of the 404 pages: a mistyped address or an old link. */
export default function NotFoundContent() {
  return (
    <>
      <PageHero
        kicker="404 · Page not found"
        title="This page seems to have wandered off"
        intro="The link may be old, or the address may have a typo. Here are a few good places to pick up from."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-gold">Back to home</Link>
          <Link href="/services" className="btn btn-outline-light">Our services</Link>
          <Link href="/contact" className="btn btn-outline-light">Contact us</Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <ul className="grid gap-5 md:grid-cols-3">
          {places.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="card card-hover group flex h-full flex-col p-6">
                <span className="font-serif text-xl text-navy">{p.label}</span>
                <span className="mt-2 leading-relaxed text-navy/75">{p.note}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brass">
                  Go there
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 rounded-xl border border-gold/50 bg-gold/10 p-5 text-sm leading-relaxed text-navy">
          <span className="font-semibold">Need support right now?</span> Call Tele-MANAS on 14416 or 1-800-891-4416, or go to the
          nearest hospital.
        </p>
      </section>
    </>
  );
}
