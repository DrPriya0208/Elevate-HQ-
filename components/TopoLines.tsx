/** Fine gold contour lines for navy hero banners. Place inside a `relative overflow-hidden` parent. */

// Wobbly closed rings around two "peaks"; computed once at module load, identical on server and client.
const peaks = [
  { cx: 1150, cy: 260, rings: 13, step: 34, phase: 0.6 },
  { cx: 380, cy: 620, rings: 7, step: 40, phase: 2.1 },
];

const contours = peaks.flatMap((p) =>
  Array.from({ length: p.rings }, (_, i) => {
    const k = i + 1;
    const r = k * p.step;
    let d = "";
    for (let s = 0; s <= 120; s++) {
      const t = (s / 120) * Math.PI * 2;
      const wob = 1 + 0.12 * Math.sin(3 * t + p.phase + k * 0.25) + 0.06 * Math.sin(5 * t - k * 0.4);
      const x = p.cx + Math.cos(t) * r * 1.35 * wob;
      const y = p.cy + Math.sin(t) * r * wob;
      d += `${s ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return { d: d + "Z", opacity: 0.16 + i * 0.012 };
  }),
);

export default function TopoLines() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      className="animate-breathe pointer-events-none absolute inset-0 h-full w-full"
    >
      {contours.map((c, i) => (
        <path key={i} d={c.d} fill="none" stroke="#F2CC73" strokeOpacity={c.opacity} strokeWidth="1.2" />
      ))}
    </svg>
  );
}
