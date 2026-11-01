"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import LogoBadge from "./LogoBadge";
import "./mind-of-light.css";

// The engine (shaders, buffers, timeline) is WebGL-only behavior with no DOM of its own:
// it just drives the refs below. next/dynamic's ssr:false keeps it out of the server
// bundle and off the main thread until after first paint, but everything it animates -
// the canvas, the badge slot, the finished logo, the Skip button - is already rendered
// right here, so there is no loading placeholder and no layout shift.
const MindOfLightEngine = dynamic(() => import("./MindOfLight"), { ssr: false });

type MindOfLightHeroProps = {
  children: ReactNode;
};

/** The "Mind of Light" hero: the site's real header/copy/buttons, with a WebGL badge animation. */
export default function MindOfLightHero({ children }: MindOfLightHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const badgeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="mind-hero" ref={heroRef} aria-label="ElevateHQ hero">
      <canvas ref={canvasRef} aria-hidden="true" />
      {/* Same container as the header (mx-auto max-w-6xl px-6), so the headline lines up with the logo.
          The badge is positioned independently (absolute) so it never narrows the text column. */}
      <div className="relative mx-auto flex min-h-[inherit] max-w-6xl flex-col items-stretch gap-12 px-6 py-16 lg:flex-row lg:items-center lg:py-24">
        <div className="logo-slot" ref={slotRef}>
          <button type="button" className="badge-btn" aria-label="Replay logo animation" ref={badgeBtnRef}>
            <div className="stage v-w wait" ref={stageRef}>
              <LogoBadge />
            </div>
            <span className="replay-icon" aria-hidden="true">
              ↻
            </span>
          </button>
        </div>
        <div className="copy max-w-2xl">{children}</div>
      </div>
      <button type="button" className="skip" ref={skipRef}>
        Skip intro
      </button>
      <MindOfLightEngine
        heroRef={heroRef}
        canvasRef={canvasRef}
        slotRef={slotRef}
        stageRef={stageRef}
        skipRef={skipRef}
        badgeBtnRef={badgeBtnRef}
      />
    </section>
  );
}
