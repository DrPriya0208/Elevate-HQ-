"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FaqItemProps = {
  q: string;
  a: string;
};

export default function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-serif text-lg font-bold transition-colors hover:text-brass"
      >
        {q}
        <motion.span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xl leading-none transition-colors ${
            open ? "border-gold bg-gold text-navy" : "border-line text-brass group-hover:border-gold"
          }`}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-1 max-w-2xl pb-5 leading-relaxed text-navy/90">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
