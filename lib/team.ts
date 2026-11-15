import { cache } from "react";
import type { TeamMember } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { TeamCard } from "@/components/team/shared";

/** One qualification per line in the admin form; blank lines dropped. */
export const qualificationList = (m: Pick<TeamMember, "qualifications">) =>
  m.qualifications.split("\n").map((q) => q.trim()).filter(Boolean);

/** Titles and degrees whose full stop does not end a sentence: "Dr. Meena", "M.Phil. in Psychology". */
const NOT_A_SENTENCE_END = /(?:^|\s)(?:dr|mr|mrs|ms|prof|st|no|vs|etc|e\.g|i\.e|[a-z])\.$|\.[a-z]+\.$/i;

/** The bio's first sentence, used as the personal line on the pinned note. The whole bio if it has only one. */
export function firstSentence(text: string): string {
  const ends = /[.!?](?=\s+["'“(]?[A-Z0-9]|\s*$)/g;
  for (let m = ends.exec(text); m; m = ends.exec(text)) {
    const upto = text.slice(0, m.index + 1);
    if (!NOT_A_SENTENCE_END.test(upto)) return upto.trim();
  }
  return text.trim();
}

/** Plain data for the public team sections (components/team). */
export function toTeamCard(m: TeamMember): TeamCard {
  const bio = m.bio.trim();
  return {
    id: m.id,
    name: m.name,
    firstName: m.name.trim().split(/\s+/)[0],
    role: m.role,
    bio,
    line: firstSentence(bio),
    qualifications: qualificationList(m),
    languages: (m.languages ?? "").split(",").map((l) => l.trim()).filter(Boolean),
    linkedin: m.linkedin,
    photo: m.photo,
  };
}

/**
 * Active team members in display order, for /about and the contact form. A database error
 * returns an empty list (logged) so those pages still render, just without the team parts.
 */
export const getActiveTeam = cache(async (): Promise<TeamMember[]> => {
  try {
    return await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (err) {
    console.error("Could not load team members", err);
    return [];
  }
});
