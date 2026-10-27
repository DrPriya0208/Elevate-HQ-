"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type HeroImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/** The hero emblem drifts and scales gently over the first screen of scroll, Lenis-smoothed. */
export default function HeroImage({ src, alt, className }: HeroImageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 600], prefersReducedMotion ? [0, 0] : [0, 90]);
  const scale = useTransform(scrollY, [0, 600], prefersReducedMotion ? [1, 1] : [1, 1.1]);

  return (
    <motion.div style={{ y, scale }} className="relative">
      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-full bg-gold/25 blur-2xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.svg
            aria-hidden
            viewBox="0 0 600 600"
            className="pointer-events-none absolute -inset-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="300"
              cy="300"
              r="320"
              fill="none"
              stroke="#F2CC73"
              strokeWidth="2"
              strokeDasharray="3 18"
              strokeLinecap="round"
              opacity="0.55"
            />
          </motion.svg>
        </>
      )}
      <Image
        src={src}
        width={380}
        height={380}
        priority
        alt={alt}
        className={`relative ${className ?? ""}`}
      />
    </motion.div>
  );
}
