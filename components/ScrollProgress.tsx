"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A thin gold bar across the top of the viewport that fills with scroll progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.2 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gold motion-reduce:hidden"
      style={{ scaleX }}
    />
  );
}
