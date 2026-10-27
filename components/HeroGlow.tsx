/** Ambient drifting glow for dark navy hero/band sections. Place inside a `relative overflow-hidden` parent. */
export default function HeroGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="animate-drift absolute -left-24 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div
        className="animate-drift absolute -bottom-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-deep-gold/10 blur-3xl"
        style={{ animationDelay: "-8s" }}
      />
    </div>
  );
}
