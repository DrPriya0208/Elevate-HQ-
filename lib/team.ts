import { cache } from "react";
import type { TeamMember } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** One qualification per line in the admin form; blank lines dropped. */
export const qualificationList = (m: Pick<TeamMember, "qualifications">) =>
  m.qualifications.split("\n").map((q) => q.trim()).filter(Boolean);

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
