"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Shared easing/durations keep every animated section feeling like one system.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Fades/slides content in once, the first time it enters the viewport. */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
};

/** Wraps a list; pair with <StaggerItem> children for a staggered reveal. */
export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const viewport = { once: true, margin: "-80px" } as const;
  if (as === "ul") {
    return (
      <motion.ul className={className} initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}>
        {children}
      </motion.ul>
    );
  }
  if (as === "ol") {
    return (
      <motion.ol className={className} initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}>
        {children}
      </motion.ol>
    );
  }
  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}>
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
};

export function StaggerItem({ children, className, as = "li" }: StaggerItemProps) {
  if (as === "div") {
    return (
      <motion.div className={className} variants={fadeUp}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.li className={className} variants={fadeUp}>
      {children}
    </motion.li>
  );
}

/** Subtle press/lift for primary actions; disabled automatically under prefers-reduced-motion via MotionConfig. */
export const tapScale = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

type ScaleInProps = {
  children: ReactNode;
  className?: string;
};

/** Scales/fades an inline element in once, the first time it enters the viewport. */
export function ScaleIn({ children, className }: ScaleInProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

/** Draws a short accent line in from the left, the first time it enters the viewport. */
export function DrawLine({ className }: { className?: string }) {
  return (
    <motion.span
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    />
  );
}

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
};

const revealWord: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/** Title reveal: each word slides up out of its own clipping mask, staggered. */
export function RevealText({ text, as = "h2", className, delay = 0 }: RevealTextProps) {
  const Tag = motion[as] as typeof motion.h2;
  const words = text.split(" ");
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i}>
          <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
            <motion.span className="inline-block" variants={revealWord}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export { motion };
