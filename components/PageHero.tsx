import type { ReactNode } from "react";
import TopoLines from "@/components/TopoLines";
import { FadeIn, RevealText } from "@/components/motion";

type Props = {
  kicker: string;
  title: string;
  intro?: string;
  children?: ReactNode;
};

export default function PageHero({ kicker, title, intro, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <TopoLines />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <FadeIn>
          <p className="kicker text-gold">{kicker}</p>
        </FadeIn>
        <RevealText
          as="h1"
          text={title}
          className="mt-3 max-w-4xl font-serif text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]"
        />
        {intro && (
          <FadeIn delay={0.15}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>
          </FadeIn>
        )}
        {children}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
