/** A team member as the public team section needs it (plain data, safe to pass to client components). */
export type TeamCard = {
  id: string;
  name: string;
  firstName: string;
  role: string;
  bio: string;
  /** The bio's first sentence, used as a personal line */
  line: string;
  qualifications: string[];
  languages: string[];
  linkedin: string | null;
  photo: string | null;
};

export const bookHref = (m: TeamCard) => `/contact?member=${encodeURIComponent(m.name)}`;
