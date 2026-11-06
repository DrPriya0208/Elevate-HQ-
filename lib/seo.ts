import type { Metadata } from "next";
import { site } from "@/lib/content";

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
