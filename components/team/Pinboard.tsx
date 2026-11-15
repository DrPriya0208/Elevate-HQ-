import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import { Icon } from "@/components/icons";
import { bookHref, type TeamCard } from "./shared";

import ShowMore from "./ShowMore";

const tilts = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2", "rotate-[-1.5deg]", "rotate-1"];
const noteTilts = ["rotate-1", "-rotate-1", "rotate-[0.75deg]", "-rotate-[0.75deg]"];

const CARD_REM = 17;
const GAP_REM = 2.5;

/**
 * Photos per row on a wide screen: never more than 3, and 4 people sit 2 + 2 rather than 3 + 1.
 * Any row that is not full is centred, which looks deliberate on a pinboard.
 */
export function boardColumns(count: number) {
  if (count <= 3) return count;
  return count === 4 ? 2 : 3;
}

/**
 * How many show before "Meet all N people": two full rows on tablets and up, three on phones
 * (each person is about a screen tall there). Hiding only one person is not worth a button.
 */
export function visibleAtFirst(count: number) {
  const limit = boardColumns(count) * 2;
  return { limit: count > limit + 1 ? limit : count, phoneLimit: count > 4 ? 3 : count };
}

function itemDisplay(i: number, limit: number, phoneLimit: number) {
  if (i < Math.min(limit, phoneLimit)) return "flex";
  const open = "group-data-[expanded=true]/board:flex";
  return i < limit ? `hidden sm:flex ${open}` : `hidden ${open}`;
}

/** Pinboard: polaroid snapshots taped to a board, each with a note pinned underneath. Works for any number of people. */
export default function Pinboard({ team }: { team: TeamCard[] }) {
  const cols = boardColumns(team.length);
  const { limit, phoneLimit } = visibleAtFirst(team.length);
  return (
    <div className="mt-10 rounded-2xl border border-line bg-white bg-[radial-gradient(rgba(138,100,24,0.14)_1px,transparent_1px)] [background-size:18px_18px] px-4 py-12 sm:px-8 md:px-12">
      <ShowMore total={team.length} limit={limit} phoneLimit={phoneLimit} listId="team-board">
      <ul
        id="team-board"
        className="mx-auto flex flex-wrap justify-center gap-x-10 gap-y-14"
        // Caps the row width so the board wraps at the chosen number of photos per row
        style={{ maxWidth: `${cols * CARD_REM + (cols - 1) * GAP_REM}rem` }}
      >
        {team.map((m, i) => (
          <li key={m.id} className={`w-full max-w-[17rem] flex-col items-center ${itemDisplay(i, limit, phoneLimit)}`}>
            <figure
              className={`group relative w-full bg-white p-3 pb-5 shadow-[0_12px_28px_rgba(10,21,48,0.16)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none ${tilts[i % tilts.length]}`}
            >
              <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-gold/45 shadow-sm" />
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-navy">
                <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(242,204,115,0.25),transparent_60%)]" />
                {m.photo ? (
                  <CoverImage src={m.photo} alt={`Photo of ${m.name}`} sizes="272px" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="relative font-serif text-8xl font-semibold text-gold/90">
                    {m.name.charAt(0)}
                  </span>
                )}
              </div>
              <figcaption className="mt-4 text-center">
                <span className="block font-serif text-xl font-semibold text-navy">{m.name}</span>
                <span className="mt-0.5 block text-sm font-semibold text-brass">{m.role}</span>
              </figcaption>
            </figure>

            {/* The note pinned under each photo */}
            <div className={`relative -mt-2 w-[94%] rounded-sm border border-gold/40 bg-[#FFF8E6] p-4 pt-5 shadow-[0_6px_14px_rgba(10,21,48,0.08)] ${noteTilts[i % noteTilts.length]}`}>
              <span aria-hidden="true" className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brass shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
              <p className="text-[0.95rem] leading-relaxed text-navy/85">{m.line}</p>
              {/* The rest of the bio, so a longer bio is still published in full */}
              {m.bio.length > m.line.length && (
                <details className="group/more mt-2">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-brass underline decoration-brass/40 underline-offset-4 hover:text-navy [&::-webkit-details-marker]:hidden">
                    <span className="group-open/more:hidden">More about {m.firstName}</span>
                    <span className="hidden group-open/more:inline">Show less</span>
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed text-navy/85">{m.bio.slice(m.line.length).trim()}</p>
                </details>
              )}
              {m.qualifications.length > 0 && (
                <p className="mt-3 flex gap-2 text-sm text-navy/70">
                  <Icon name="award" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                  {m.qualifications.join(" · ")}
                </p>
              )}
              {m.languages.length > 0 && <p className="mt-2 text-sm text-slate">Speaks {m.languages.join(", ")}</p>}
              <div className="mt-4 flex items-center justify-between gap-3">
                <Link href={bookHref(m)} className="text-sm font-semibold text-navy underline decoration-brass underline-offset-4 hover:text-brass">
                  Book with {m.firstName}
                </Link>
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name}'s LinkedIn profile, opens in a new tab`} className="text-navy hover:text-brass">
                    <Icon name="linkedin" className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      </ShowMore>
    </div>
  );
}
