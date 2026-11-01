import { DrawLine, FadeIn, RevealText } from "@/components/motion";

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
  /** Soft gold light behind the heading, for a few key sections on light backgrounds. */
  glow?: boolean;
  className?: string;
};

export default function SectionHeading({ kicker, title, intro, center = false, dark = false, glow = false, className = "" }: Props) {
  return (
    <div className={`relative ${center ? "mx-auto text-center" : ""} ${className}`}>
      {glow && (
        // A radial gradient fades to nothing on its own; a blurred box gets visibly clipped at its edges.
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-40 h-[34rem] w-[34rem] rounded-full ${
            center ? "left-1/2 -ml-[17rem]" : "-left-52"
          }`}
          style={{ background: "radial-gradient(circle, rgba(242,204,115,0.26) 0%, rgba(242,204,115,0.1) 38%, rgba(242,204,115,0) 68%)" }}
        />
      )}
      <div className="relative">
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
    </div>
  );
}
