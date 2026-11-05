"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

/*
 * Scroll reveals that never hide content in the server HTML.
 *
 * Every element renders fully visible, so the page paints at once (good LCP) and still shows if a
 * script fails. After hydration, an element that is still below the viewport gets `reveal-pending`
 * (hidden, see globals.css) and, when it scrolls into view, `reveal-in` to animate in. Elements already
 * on screen at hydration are never hidden. Under prefers-reduced-motion nothing is hidden at all.
 */

const REVEAL_MARGIN = 80; // px: start the reveal a little before the element reaches the viewport
const REVEAL_CLEANUP_MS = 2000; // longest entrance: 480ms stagger delay + 650ms word slide, plus any FadeIn delay

function useReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen (or above it): leave it visible, no animation.
    if (el.getBoundingClientRect().top < window.innerHeight - REVEAL_MARGIN) return;

    el.classList.add("reveal-pending");
    let done: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Reveal when it enters the viewport, or if a fast fling carried it past (already above
        // the viewport): otherwise scrolling back up would find it still hidden.
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        el.classList.add("reveal-in");
        io.disconnect();
        // Once the entrance has played, drop the reveal classes so the element's own
        // hover transitions and transforms (card lifts, colour fades) apply untouched.
        done = window.setTimeout(() => el.classList.remove("reveal-pending", "reveal-in"), REVEAL_CLEANUP_MS);
      },
      // No negative margin: an element at the very bottom of the page must still be able to trigger
      { rootMargin: "0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(done);
    };
  }, [ref]);
}

const delayStyle = (delay: number): CSSProperties | undefined =>
  delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined;

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Fades/slides content in once, the first time it scrolls into view. */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} className={`reveal-fade ${className ?? ""}`} style={delayStyle(delay)}>
      {children}
    </div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
};

/** Wraps a list; its <StaggerItem> children reveal one after another. */
export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const Tag = as;
  return (
    <Tag ref={ref as RefObject<never>} className={`reveal-stagger ${className ?? ""}`}>
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
};

export function StaggerItem({ children, className, as = "li" }: StaggerItemProps) {
  const Tag = as;
  return <Tag className={`reveal-item ${className ?? ""}`}>{children}</Tag>;
}

/** Subtle press/lift for primary actions; disabled automatically under prefers-reduced-motion via MotionConfig. */
export const tapScale = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

type ScaleInProps = {
  children: ReactNode;
  className?: string;
};

/** Scales/fades an inline element in once, the first time it scrolls into view. */
export function ScaleIn({ children, className }: ScaleInProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useReveal(ref);
  return (
    <span ref={ref} className={`reveal-scale ${className ?? ""}`}>
      {children}
    </span>
  );
}

/** Draws a short accent line in from the left, the first time it scrolls into view. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useReveal(ref);
  return <span ref={ref} className={`reveal-line ${className ?? ""}`} />;
}

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
};

/** Title reveal: each word slides up out of its own clipping mask, staggered. */
export function RevealText({ text, as = "h2", className, delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useReveal(ref);
  const Tag = as;
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`reveal-words ${className ?? ""}`} style={delayStyle(delay)}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
            <span className="reveal-word inline-block" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export { motion };
