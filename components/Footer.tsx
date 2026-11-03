import Image from "next/image";
import Link from "next/link";
import StarField from "@/components/StarField";
import { Icon } from "@/components/icons";
import { site, socials } from "@/lib/content";

const pages = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="speckle relative overflow-hidden bg-ink text-white/80">
      <StarField count={90} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/elevatehq-logo-dark-playfair.svg" alt="" width={52} height={52} priority />
            <p className="font-serif text-2xl font-semibold text-white">{site.name}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
          <Link href="/contact" className="btn btn-gold mt-6 !px-5 !py-2.5 text-sm">Book a session</Link>
        </div>

        <div>
          <p className="kicker text-gold">Pages</p>
          <ul className="mt-3 text-sm md:mt-5 md:space-y-3">
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group inline-flex min-h-10 items-center gap-2 transition-colors hover:text-gold md:min-h-0"
                >
                  <span aria-hidden className="h-px w-3 bg-white/30 transition-all duration-300 group-hover:w-5 group-hover:bg-gold" />
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker text-gold">Contact</p>
          <ul className="mt-3 space-y-1 text-sm md:mt-5 md:space-y-4">
            <li>
              <a href={site.phoneHref} className="flex min-h-10 items-center gap-3 transition-colors hover:text-gold md:min-h-0">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-gold" />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex min-h-10 items-center gap-3 break-words transition-colors hover:text-gold md:min-h-0"
              >
                <Icon name="mail" className="h-4 w-4 shrink-0 text-gold" />
                <span className="min-w-0">
                  {site.email.split("@")[0]}@<wbr />
                  {site.email.split("@")[1]}
                </span>
              </a>
            </li>
            <li className="flex min-h-10 items-center gap-3 md:min-h-0">
              <Icon name="pin" className="h-4 w-4 shrink-0 text-gold" />
              {site.location}
            </li>
          </ul>

          <p className="kicker mt-8 text-gold">Follow us</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.name}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name}, opens in a new tab`}
                    title={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-navy"
                  >
                    <Icon name={s.icon} className="h-[18px] w-[18px]" />
                  </a>
                ) : (
                  <span
                    title={`${s.name} (coming soon)`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80"
                  >
                    <Icon name={s.icon} className="h-[18px] w-[18px]" />
                    <span className="sr-only">{s.name} (coming soon)</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm leading-relaxed text-white/60 md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="max-w-2xl">
            If you or someone you know is in crisis or at risk of harm, do not wait for an appointment. Call the Tele-MANAS
            helpline on 14416 or 1-800-891-4416, or go to the nearest hospital.
          </p>
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <p className="flex gap-6">
              <Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors hover:text-gold md:min-h-0">
                Privacy Policy
              </Link>
              <Link href="/terms" className="inline-flex min-h-10 items-center transition-colors hover:text-gold md:min-h-0">
                Terms &amp; Conditions
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
