"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useStore } from "@/lib/store";

import Scene0Boot from "./Scene0Boot";
import Scene1Hero from "./Scene1Hero";
import Scene2Wisdom from "./Scene2Wisdom";
import Scene3Road from "./Scene3Road";
import Scene4Diwan from "./Scene4Diwan";
import Scene5Covenant from "./Scene5Covenant";
import Scene6Horizon from "./Scene6Horizon";

gsap.registerPlugin(ScrollTrigger);

const SCENE_COUNT = 7;

const BG_COLORS = [
  "#000000", // scene 0 — boot
  "#050505", // scene 1 — hero
  "#0A0A0A", // scene 2 — wisdom
  "#0F0F0F", // scene 3 — road
  "#0A0A0A", // scene 4 — diwan / faq
  "#050505", // scene 5 — covenant
  "#000000", // scene 6 — horizon
];

export default function SceneOrchestrator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useStore((s) => s.setActiveScene);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-scene]",
        containerRef.current
      );

      ScrollTrigger.matchMedia({
        "(min-width: 769px)": function () {
          sections.forEach((section, i) => {
            const isFooter = i === 7 || section.getAttribute("data-scene") === "7";

            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: isFooter ? "bottom bottom" : "+=100%",
              pin: !isFooter,
              scrub: 1,
              onEnter: () => setActiveScene(i),
              onEnterBack: () => setActiveScene(i),
            });

            if (i < SCENE_COUNT - 1 && containerRef.current) {
              gsap.to(containerRef.current, {
                backgroundColor: BG_COLORS[i + 1],
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1,
                },
              });
            }
          });
        },
      });
      if (containerRef.current) {
        gsap.set(containerRef.current, { backgroundColor: BG_COLORS[0] });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full transition-colors duration-300">
      <section data-scene="0" className="scene-section">
        <Scene0Boot />
      </section>
      <section data-scene="1" className="scene-section">
        <Scene1Hero />
      </section>
      <section data-scene="2" className="scene-section">
        <Scene2Wisdom />
      </section>
      <section data-scene="3" className="scene-section">
        <Scene3Road />
      </section>
      <section data-scene="4" className="scene-section">
        <Scene4Diwan />
      </section>
      <section data-scene="5" className="scene-section">
        <Scene5Covenant />
      </section>
      <section data-scene="6" className="scene-section" style={{ minHeight: "auto" }}>
        <Scene6Horizon />
      </section>
    </div>
  );
}
