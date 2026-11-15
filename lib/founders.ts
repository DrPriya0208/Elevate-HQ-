import { cache } from "react";
import type { FounderProfile as Row } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { coFounder, founder, site } from "@/lib/content";

export const founderKeys = ["founder", "co-founder"] as const;
export type FounderKey = (typeof founderKeys)[number];
export const isFounderKey = (k: string): k is FounderKey => (founderKeys as readonly string[]).includes(k);

/** A founder card as /about shows it. */
export type Founder = {
  key: FounderKey;
  /** Fixed in lib/content.ts: it also appears in the privacy policy and search data */
  name: string;
  role: string;
  photo: string | null;
  headline: string | null;
  bio: string[];
  tags: string[];
  qualifications: string[];
  alsoOffered: string | null;
  linkedin: string | null;
};

/** The original text from lib/content.ts, used until a profile is first saved in the admin. */
export const founderDefaults: Record<FounderKey, Founder> = {
  founder: {
    key: "founder",
    name: founder.name,
    role: founder.role,
    photo: null,
    headline: null,
    bio: [],
    tags: founder.titles,
    qualifications: founder.qualifications,
    alsoOffered: founder.alsoOffered,
    linkedin: site.linkedin,
  },
  "co-founder": {
    key: "co-founder",
    name: coFounder.name,
    role: coFounder.role,
    photo: null,
    headline: coFounder.headline,
    bio: coFounder.bio,
    tags: coFounder.strengths,
    qualifications: [],
    alsoOffered: null,
    linkedin: coFounder.linkedin,
  },
};

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);

function fromRow(key: FounderKey, r: Row): Founder {
  return {
    key,
    name: founderDefaults[key].name,
    role: r.role,
    photo: r.photo,
    headline: r.headline,
    bio: paragraphs(r.bio),
    tags: lines(r.tags),
    qualifications: lines(r.qualifications),
    alsoOffered: r.alsoOffered,
    linkedin: r.linkedin,
  };
}

/**
 * Both founder cards, saved edits over the original text. A database error falls back to the
 * original text (logged), so /about still renders.
 */
export const getFounders = cache(async (): Promise<Record<FounderKey, Founder>> => {
  try {
    const rows = await prisma.founderProfile.findMany();
    const saved = new Map(rows.map((r) => [r.key, r]));
    const pick = (k: FounderKey) => {
      const r = saved.get(k);
      return r ? fromRow(k, r) : founderDefaults[k];
    };
    return { founder: pick("founder"), "co-founder": pick("co-founder") };
  } catch (err) {
    console.error("Could not load founder profiles", err);
    return founderDefaults;
  }
});

/** Values for the admin form: lists one per line, paragraphs separated by a blank line. */
export function toFormValues(f: Founder) {
  return {
    role: f.role,
    photo: f.photo ?? "",
    headline: f.headline ?? "",
    bio: f.bio.join("\n\n"),
    tags: f.tags.join("\n"),
    qualifications: f.qualifications.join("\n"),
    alsoOffered: f.alsoOffered ?? "",
    linkedin: f.linkedin ?? "",
  };
}
export type FounderFormValues = ReturnType<typeof toFormValues>;
