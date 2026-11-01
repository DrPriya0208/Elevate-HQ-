import Image from "next/image";
import type { ReactNode } from "react";
import HeroGlow from "@/components/HeroGlow";
import { Icon } from "@/components/icons";
import { DrawLine, FadeIn, RevealText } from "@/components/motion";

export type HeroChip = { label: string; icon: string };

type Props = {
  kicker: string;
  title: string;
  intro?: string;
  /** Up to three short tags that float around the arch; vary them per page. */
  chips?: HeroChip[];
  children?: ReactNode;
};

// Left, right, left, so the tags frame the arch rather than stacking on one side.
const chipPositions = ["left-[-3.5rem] top-[18%]", "right-[-3rem] top-[48%]", "left-[-2rem] bottom-[12%]"];

export default function PageHero({ kicker, title, intro, chips = [], children }: Props) {
  return (
    <section className="speckle relative overflow-hidden bg-navy text-white">
      <HeroGlow />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:py-24 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <FadeIn>
            <p className="kicker text-gold">{kicker}</p>
          </FadeIn>
          <RevealText
            as="h1"
            text={title}
            className="mt-4 max-w-3xl font-serif text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]"
          />
          <DrawLine className="mt-6 block h-[3px] w-20 origin-left rounded-full bg-gold" />
          {intro && (
            <FadeIn delay={0.15}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{intro}</p>
            </FadeIn>
          )}
          {children}
        </div>

        {/* Arched window with the emblem; desktop only, the text carries the hero on smaller screens */}
        <FadeIn delay={0.2} className="relative mx-auto hidden h-[25rem] w-[18rem] lg:block">
          <div aria-hidden className="absolute inset-0 overflow-hidden rounded-t-full border border-gold/40 bg-gradient-to-b from-gold/35 via-deep-gold/10 to-ink/40">
            <div className="absolute inset-3 rounded-t-full border border-gold/20" />
            <div className="absolute inset-x-0 top-[22%] flex justify-center">
              <div className="h-40 w-40 rounded-full bg-gold/30 blur-2xl" />
            </div>
            <Image
              src="/elevatehq-logo-light-playfair.svg"
              alt=""
              width={200}
              height={200}
              priority
              className="absolute left-1/2 top-[18%] h-auto w-44 -translate-x-1/2"
            />
          </div>
          {chips.length > 0 && (
            <ul>
              {chips.slice(0, 3).map((c, i) => (
                <li
                  key={c.label}
                  className={`animate-float absolute ${chipPositions[i]} flex items-center gap-2 whitespace-nowrap rounded-full border border-gold/30 bg-ink/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur`}
                  style={{ animationDelay: `${-i * 2}s` }}
                >
                  <Icon name={c.icon} className="h-4 w-4 text-gold" />
                  {c.label}
                </li>
              ))}
            </ul>
          )}
        </FadeIn>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
