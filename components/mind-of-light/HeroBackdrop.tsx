/** Home hero background: twinkling gold and white stars across the navy, with an occasional shooting star. */

// Deterministic star field so server and client render the same positions.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const stars = (() => {
  const r = rng(7);
  return Array.from({ length: 140 }, () => ({
    x: r() * 100,
    y: r() * 100,
    size: r() < 0.12 ? 3 : r() * 1.6 + 1,
    delay: r() * 5,
    gold: r() > 0.45,
  }));
})();

export default function HeroBackdrop() {
  return (
    <div aria-hidden className="hero-backdrop">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.gold ? "#F2CC73" : "#ffffff",
            boxShadow: s.size > 2 ? "0 0 10px 3px rgba(242,204,115,.75)" : "0 0 4px rgba(242,204,115,.5)",
            animationDuration: `${3 + (i % 4)}s`,
            animationDelay: `${-s.delay}s`,
          }}
        />
      ))}
      {[0, 1].map((i) => (
        <span key={i} className="shooting-star" style={{ right: `${8 + i * 22}%`, top: `${6 + i * 10}%`, animationDelay: `${i * 4.5}s` }} />
      ))}
    </div>
  );
}
