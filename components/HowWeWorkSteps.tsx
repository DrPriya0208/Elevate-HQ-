"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { FadeIn } from "@/components/motion";
import { howWeWork } from "@/lib/content";

const LAST = howWeWork.length - 1;

/**
 * Hover a step: the gold trail fills from step 1 up to it, and its number swaps for an icon.
 * Touch screens have no hover, so the trail fills on its own when the section scrolls into view.
 */
export default function HowWeWorkSteps() {
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setCanHover(hover);
    if (hover) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = listRef.current;
    if (!el) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setActive(LAST);
          return;
        }
        howWeWork.forEach((_, i) => timers.push(window.setTimeout(() => setActive(i), 300 + i * 450)));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // Circle centres sit at 10%, 30% ... 90% of the row, so the trail spans 80% at most.
  const trail = active === null ? 0 : (active / LAST) * 80;

  return (
    <FadeIn className="relative mt-16">
      <div onMouseLeave={() => canHover && setActive(null)}>
        <span aria-hidden className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gold/30 lg:block" />
        <span
          aria-hidden
          className="absolute left-[10%] top-8 hidden h-0.5 -translate-y-px rounded-full bg-gold transition-[width] duration-500 ease-out motion-reduce:transition-none lg:block"
          style={{ width: `${trail}%` }}
        />
        <ol ref={listRef} className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {howWeWork.map((step, i) => {
            const lit = active !== null && i <= active;
            const current = i === active;
            return (
              <li
                key={step.title}
                className="relative flex flex-col items-center px-2 text-center"
                onMouseEnter={() => canHover && setActive(i)}
              >
                <span
                  className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-gold font-serif text-2xl font-bold text-navy transition-[background-color,transform,box-shadow] duration-300 motion-reduce:transition-none ${
                    lit ? "bg-gold" : "bg-white"
                  } ${
                    current
                      ? "-translate-y-1 shadow-[0_0_0_8px_white,0_12px_24px_rgba(212,165,58,0.35)]"
                      : "shadow-[0_0_0_8px_white]"
                  }`}
                >
                  <span
                    className={`absolute transition-[transform,opacity] duration-300 motion-reduce:transition-none ${
                      current ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    aria-hidden
                    className={`absolute transition-[transform,opacity] duration-300 motion-reduce:transition-none ${
                      current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
                  >
                    <Icon name={step.icon} className="h-7 w-7" />
                  </span>
                </span>
                <h3 className={`mt-6 font-serif text-xl transition-colors duration-300 ${current ? "text-brass" : ""}`}>
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-navy/80">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </FadeIn>
  );
}
