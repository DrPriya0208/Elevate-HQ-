import type { ReactNode } from "react";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/motion";

type Props = {
  kicker: string;
  title: string;
  updated: string;
  sections: { id: string; title: string }[];
  children: ReactNode;
};

export default function LegalPage({ kicker, title, updated, sections, children }: Props) {
  return (
    <>
      <PageHero kicker={kicker} title={title} intro={`Last updated: ${updated}`} />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="On this page" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="kicker text-brass">On this page</p>
          <ol className="mt-4 space-y-2.5 border-l border-line text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-slate transition-colors hover:border-gold hover:text-navy">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <FadeIn className="card legal p-8 md:p-12">{children}</FadeIn>
      </div>
    </>
  );
}
