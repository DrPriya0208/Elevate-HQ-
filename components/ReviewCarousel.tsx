"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Stars from "@/components/Stars";

export type CarouselReview = { id: string; name: string; rating: number; message: string; date: string };

const DRIFT_PX_PER_SEC = 40;
const DIRECTION = -1; // -1: cards float left to right, 1: right to left
const RESUME_AFTER_TOUCH_MS = 2500;

/**
 * Testimonials that float continuously in an endless loop and can be swiped, dragged or jumped to with the dots.
 * The list is rendered twice so the loop is seamless; native scrolling keeps touch and trackpad swipes working.
 * The drift pauses while the visitor hovers, focuses or touches it, and is off for reduced motion.
 */
export default function ReviewCarousel({ reviews }: { reviews: CarouselReview[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [multi, setMulti] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const pos = useRef(0);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const touchTimer = useRef<number | undefined>(undefined);
  const n = reviews.length;

  // Distance from one card to the next (card width + gap)
  const stepOf = (track: HTMLElement) => {
    const card = track.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0") : 0;
  };

  // Only loop when there are more reviews than fit in view
  const measure = useCallback(() => {
    const track = trackRef.current;
    const step = track ? stepOf(track) : 0;
    if (!track || !step) return;
    const perView = Math.max(1, Math.floor((track.clientWidth - 48 + 24) / step)); // minus px-6 padding, plus one gap
    setMulti(n > perView);
  }, [n]);

  const onScroll = () => {
    const track = trackRef.current;
    const step = track ? stepOf(track) : 0;
    if (!track || !step) return;
    setActive(Math.round((track.scrollLeft % (step * n)) / step) % n);
  };

  // Keep the scroll position inside the first copy so both directions can loop
  const normalise = (track: HTMLElement, step: number) => {
    const set = step * n;
    let cur = track.scrollLeft;
    if (cur >= set) cur -= set;
    if (cur < step) cur += set;
    track.scrollLeft = cur;
    return cur;
  };

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const step = track ? stepOf(track) : 0;
      if (!track || !step) return;
      const cur = normalise(track, step);
      const base = cur >= step * n ? step * n : 0;
      track.scrollTo({ left: base + i * step, behavior: "smooth" });
    },
    [n],
  );

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Pick up from wherever the visitor left it when the drift resumes
  useEffect(() => {
    pausedRef.current = paused;
    if (!paused && trackRef.current) pos.current = trackRef.current.scrollLeft;
  }, [paused]);

  // Continuous drift, wrapping seamlessly between the two copies
  useEffect(() => {
    if (!multi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const track = trackRef.current;
      const step = track ? stepOf(track) : 0;
      if (track && step && !pausedRef.current && document.visibilityState === "visible") {
        const set = step * n;
        pos.current = (((pos.current + (DIRECTION * DRIFT_PX_PER_SEC * dt) / 1000) % set) + set) % set;
        track.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    if (trackRef.current) pos.current = trackRef.current.scrollLeft;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [multi, n]);

  // Mouse drag to slide (touch and trackpads already scroll natively)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !trackRef.current) return;
    trackRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    drag.current = null;
  };

  const onTouchStart = () => {
    window.clearTimeout(touchTimer.current);
    setPaused(true);
  };
  const onTouchEnd = () => {
    touchTimer.current = window.setTimeout(() => setPaused(false), RESUME_AFTER_TOUCH_MS);
  };

  const card = (r: CarouselReview, i: number, copy: boolean) => (
    <li
      key={`${copy ? "b" : "a"}-${r.id}`}
      aria-hidden={copy || undefined}
      aria-roledescription={copy ? undefined : "slide"}
      aria-label={copy ? undefined : `${i + 1} of ${n}`}
      className="card relative flex w-[85%] shrink-0 select-none flex-col p-7 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
    >
      <span aria-hidden className="absolute right-6 top-3 font-serif text-7xl leading-none text-gold/40">“</span>
      <Stars rating={r.rating} />
      <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed">{r.message}</p>
      <p className="mt-auto pt-5 text-sm font-semibold text-navy">
        {r.name}
        <span className="font-normal text-slate"> · {r.date}</span>
      </p>
    </li>
  );

  return (
    <div
      className="mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        endDrag();
        setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client reviews"
    >
      <ul
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        className={`-mx-6 flex gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          multi ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        {reviews.map((r, i) => card(r, i, false))}
        {multi && reviews.map((r, i) => card(r, i, true))}
      </ul>

      {multi && (
        <div className="mt-6 flex flex-wrap gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show review ${i + 1}`}
                aria-current={i === active}
                className="flex h-6 items-center"
              >
                <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? "w-7 bg-deep-gold" : "w-2 bg-line hover:bg-brass"}`} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
