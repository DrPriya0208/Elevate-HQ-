import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="speckle bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/elevatehq-logo-dark-playfair.svg" alt="" width={40} height={40} />
            <p className="font-serif text-2xl font-bold text-white">{site.name}</p>
          </div>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
        </div>

        <div>
          <p className="font-serif text-lg font-bold text-gold">Pages</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/services" className="hover:text-gold">Services</Link></li>
            <li><Link href="/blog" className="hover:text-gold">Blog</Link></li>
            <li><Link href="/reviews" className="hover:text-gold">Reviews</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-serif text-lg font-bold text-gold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={site.phoneHref} className="hover:text-gold">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="break-all hover:text-gold">{site.email}</a></li>
            <li>{site.location}</li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile, opens in a new tab"
                className="hover:text-gold"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-ink">
        <div className="mx-auto max-w-6xl space-y-2 px-6 py-6 text-sm leading-relaxed text-white/70">
          <p>
            If you or someone you know is in crisis or at risk of harm, do not wait for an appointment. Call the Tele-MANAS
            helpline on 14416 or 1-800-891-4416, or go to the nearest hospital.
          </p>
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
