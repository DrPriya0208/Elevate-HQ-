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

export { motion };
