import { DrawLine, FadeIn, RevealText } from "@/components/motion";

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
  className?: string;
};

export default function SectionHeading({ kicker, title, intro, center = false, dark = false, className = "" }: Props) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} ${className}`}>
      {kicker && (
        <FadeIn>
          <p className={`kicker ${dark ? "text-gold" : "text-brass"}`}>{kicker}</p>
        </FadeIn>
      )}
      <RevealText
        as="h2"
        text={title}
        className={`mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl ${dark ? "text-white" : ""} ${center ? "mx-auto" : ""}`}
      />
      <DrawLine className={`mt-5 block h-[3px] w-16 rounded-full bg-gold ${center ? "mx-auto origin-center" : "origin-left"}`} />
      {intro && (
        <FadeIn delay={0.1}>
          <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? "text-white/80" : "text-navy/80"} ${center ? "mx-auto" : ""}`}>
            {intro}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
