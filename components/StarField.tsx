/** Gold and white stars for navy backgrounds. Still by default; `live` (the home hero only, the one place
 * where motion is the point) adds twinkling, the glow on the larger stars and the occasional shooting star.
 * Place inside a `relative overflow-hidden` parent. */

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
    size: r() < 0.1 ? 2.4 : r() * 1.4 + 0.6,
    delay: r() * 5,
    gold: r() > 0.45,
  }));
})();

/** `count` lets shorter banners use fewer stars so the density matches the home hero. */
export default function StarField({ count = stars.length, live = false }: { count?: number; live?: boolean }) {
  return (
    <div aria-hidden className="star-field">
      {stars.slice(0, count).map((s, i) => (
        <span
          key={i}
          className={live ? "star star-live" : "star"}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.gold ? "#F2CC73" : "#ffffff",
            ...(live
              ? {
                  boxShadow: s.size > 2 ? "0 0 8px 2px rgba(242,204,115,.7)" : undefined,
                  animationDuration: `${3 + (i % 4)}s`,
                  animationDelay: `${-s.delay}s`,
                }
              : // Still stars keep the variety of a night sky through brightness instead of motion
                { opacity: 0.25 + ((i * 37) % 60) / 100 }),
          }}
        />
      ))}
      {live &&
        [0, 1].map((i) => (
          <span key={i} className="shooting-star" style={{ right: `${8 + i * 22}%`, top: `${6 + i * 10}%`, animationDelay: `${i * 4.5}s` }} />
        ))}
    </div>
  );
}
