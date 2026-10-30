import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { site } from "@/lib/content";

const pages = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="speckle relative bg-ink text-white/80">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/elevatehq-logo-dark-playfair.svg" alt="" width={52} height={52} priority />
            <p className="font-serif text-2xl font-bold text-white">{site.name}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
          <Link href="/contact" className="btn btn-gold mt-6 !px-5 !py-2 text-sm">Book a session</Link>
        </div>

        <div>
          <p className="kicker text-gold">Pages</p>
          <ul className="mt-5 space-y-3 text-sm">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="group inline-flex items-center gap-2 transition-colors hover:text-gold">
                  <span aria-hidden className="h-px w-3 bg-white/30 transition-all duration-300 group-hover:w-5 group-hover:bg-gold" />
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker text-gold">Contact</p>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-gold" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 break-all transition-colors hover:text-gold">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-gold" />
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="pin" className="h-4 w-4 shrink-0 text-gold" />
              {site.location}
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile, opens in a new tab"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Icon name="person" className="h-4 w-4 shrink-0 text-gold" />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm leading-relaxed text-white/60 md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="max-w-2xl">
            If you or someone you know is in crisis or at risk of harm, do not wait for an appointment. Call the Tele-MANAS
            helpline on 14416 or 1-800-891-4416, or go to the nearest hospital.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
