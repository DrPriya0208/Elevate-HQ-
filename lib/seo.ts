import type { Metadata } from "next";
import { founder, services, site } from "@/lib/content";

/** Serialise structured data for a <script type="application/ld+json">, escaping "<" so no string can close the tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** The practice as a ProfessionalService (schema.org), built only from facts already on the site. */
export function practiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#practice`,
    name: site.name,
    description: site.tagline,
    url: site.url,
    logo: `${site.url}/elevatehq-logo-dark-playfair-1024.png`,
    image: `${site.url}/opengraph-image.jpg`,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: "Sholinganallur, Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    areaServed: "IN",
    founder: { "@type": "Person", name: founder.name, jobTitle: founder.role, sameAs: [site.linkedin] },
    sameAs: [site.linkedin],
    knowsAbout: services.map((s) => s.title),
  };
}

/** A blog post as an Article (schema.org). */
export function articleJsonLd(post: { title: string; excerpt: string; slug: string; coverImage: string | null; publishedAt: Date | null; updatedAt: Date }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${site.url}/blog/${post.slug}`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    image: post.coverImage ?? `${site.url}/opengraph-image.jpg`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: founder.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/elevatehq-logo-dark-playfair-1024.png` } },
  };
}

type PageMeta = {
  /** Short page name; the layout's title template adds " | Elevate HQ" in the browser tab. */
  title: string;
  description: string;
  /** Path from the site root, e.g. "/services". Used for the canonical URL and og:url. */
  path: string;
};

/**
 * The shared link-preview image (app/opengraph-image.jpg, 1200x630). Next does not deep-merge
 * openGraph, so any page that sets its own openGraph must name the image again or lose it.
 */
export const OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Elevate HQ logo beside the words: Elevate HQ, Psychology and Human Development Services. Psychology for every stage of life and work.",
};

/** Large-image preview card on X/Twitter (the default was the small square "summary" card). */
export const TWITTER_LARGE = { card: "summary_large_image" as const };

/**
 * Per-page metadata with its own link-preview fields. Without this, child pages inherit the root
 * layout's openGraph title, so every page shared on LinkedIn or WhatsApp showed the home page title.
 */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_IN",
      title: `${title} | ${site.name}`,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: TWITTER_LARGE,
  };
}
