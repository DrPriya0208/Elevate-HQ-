"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Stars from "@/components/Stars";

export type CarouselReview = { id: string; name: string; rating: number; message: string; date: string };

const AUTOPLAY_MS = 5000;

/**
 * Testimonials that glide right-to-left on their own and can be swiped, dragged or stepped with the arrows.
 * Native scroll-snap does the sliding, so touch and trackpad swipes work without any extra code.
 * Autoplay pauses while the visitor hovers, focuses or touches it, and is off for reduced motion.
 */
export default function ReviewCarousel({ reviews }: { reviews: CarouselReview[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  // Distance from one card to the next (card width + gap)
  const stepOf = (track: HTMLElement) => {
    const card = track.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0") : 0;
  };

  // How many "stops" the track has, given how many cards fit in view
  const measure = useCallback(() => {
    const track = trackRef.current;
    const step = track ? stepOf(track) : 0;
    if (!track || !step) return;
    const perView = Math.max(1, Math.floor((track.clientWidth - 48 + 24) / step)); // minus px-6 padding, plus one gap
    setPages(Math.max(1, reviews.length - perView + 1));
    setActive(Math.min(reviews.length - 1, Math.round(track.scrollLeft / step)));
  }, [reviews.length]);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * stepOf(track), behavior: "smooth" });
  }, []);

  const next = useCallback(() => goTo(active + 1 >= pages ? 0 : active + 1), [active, pages, goTo]);
  const prev = useCallback(() => goTo(active - 1 < 0 ? pages - 1 : active - 1), [active, pages, goTo]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Autoplay, right to left, looping back to the first card
  useEffect(() => {
    if (paused || pages <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") next();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, pages, next]);

  // Mouse drag to slide (touch and trackpads already scroll natively)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
    trackRef.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !trackRef.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    if (!drag.current || !trackRef.current) return;
    const track = trackRef.current;
    const target = Math.min(pages - 1, Math.max(0, Math.round(track.scrollLeft / stepOf(track))));
    track.style.scrollSnapType = "";
    drag.current = null;
    goTo(target);
  };

  const multi = pages > 1;

  return (
    <div
      className="mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client reviews"
    >
      <ul
        ref={trackRef}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          multi ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        {reviews.map((r, i) => (
          <li
            key={r.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
            className="card relative flex w-[85%] shrink-0 snap-start select-none flex-col p-7 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <span aria-hidden className="absolute right-6 top-3 font-serif text-7xl leading-none text-gold/40">“</span>
            <Stars rating={r.rating} />
            <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed">{r.message}</p>
            <p className="mt-auto pt-5 text-sm font-semibold text-navy">
              {r.name}
              <span className="font-normal text-slate"> · {r.date}</span>
            </p>
          </li>
        ))}
      </ul>

      {multi && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
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
          <div className="flex gap-2">
            <button type="button" onClick={prev} aria-label="Previous review" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:border-gold hover:bg-gold">
              <span aria-hidden className="text-xl leading-none">←</span>
            </button>
            <button type="button" onClick={next} aria-label="Next review" className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-ink">
              <span aria-hidden className="text-xl leading-none">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
