"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, type MotionValue } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { timelineData } from "@/lib/data";

// Scroll distance dedicated to each entry — higher = slower pace, more
// scrolling required to move from one node to the next.
const VH_PER_ENTRY = 180;

// Every node's position, on-screen size, and opacity all come from this one
// constant plus the live scroll progress — there's exactly one formula, so
// the rail line and the dots can never drift out of sync with each other.
// Raising it is literally "space the nodes out more."
const NODE_GAP_PCT = 34;

const FALLOFF_SCALE   = 0.3;
const FALLOFF_OPACITY = 0.55;

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const size = 22;
  const base: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    borderColor: "rgba(255,106,0,0.5)",
  };
  const map: Record<string, React.CSSProperties> = {
    tl: { ...base, top: 0, left: 0, borderTop: "2px solid", borderLeft: "2px solid" },
    tr: { ...base, top: 0, right: 0, borderTop: "2px solid", borderRight: "2px solid" },
    bl: { ...base, bottom: 0, left: 0, borderBottom: "2px solid", borderLeft: "2px solid" },
    br: { ...base, bottom: 0, right: 0, borderBottom: "2px solid", borderRight: "2px solid" },
  };
  return <div style={map[pos]} />;
}

// One node's mark on the rail. Its vertical slot is `i * NODE_GAP_PCT` away
// from center — the exact same formula the rail's traveled/remaining split
// uses — so every dot sits literally where the line says it should, at
// whatever speed the scroll math implies, no separately-tuned rate to drift
// out of step with it. Distance from center also drives its own scale/opacity
// falloff, so the dot nearest the active story reads as biggest and brightest.
function RailDot({
  t, i, N, progress, activeIndex,
}: {
  t: (typeof timelineData)[number];
  i: number;
  N: number;
  progress: MotionValue<number>;
  activeIndex: number;
}) {
  const denom = N - 1 || 1;
  const top = useTransform(progress, (p) => `${50 + (i - p * denom) * NODE_GAP_PCT}%`);
  const scale = useTransform(progress, (p) => Math.max(0.4, 1 - Math.abs(i - p * denom) * FALLOFF_SCALE));
  const opacity = useTransform(progress, (p) => Math.max(0, 1 - Math.abs(i - p * denom) * FALLOFF_OPACITY));

  const isActive = i === activeIndex;
  const isPassed = i < activeIndex;
  const size = isActive ? 30 : isPassed ? 18 : 15;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: "50%", top, x: "-50%", y: "-50%", scale, opacity,
        width: size, height: size,
        background: isActive || isPassed ? t.color : "var(--bg)",
        border: `3px solid ${t.color}`,
        boxShadow: isActive ? `0 0 0 7px ${t.color}22, 0 0 26px ${t.color}66` : "none",
        zIndex: isActive ? 3 : 1,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    />
  );
}

// The ONLY story on screen at a time — plain, bare text (no card box around
// it) pinned dead-center so it stays legible, swiping up-and-in as it
// arrives and up-and-out as it leaves.
function ActiveEntry({
  t, side,
}: {
  t: (typeof timelineData)[number];
  side: "left" | "right";
}) {
  const sideOffset = side === "left" ? { right: "54%" } : { left: "54%" };
  const images = "images" in t ? t.images : undefined;

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, y: 46 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -46 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
    >
      <div
        className="absolute top-1/2"
        style={{
          transform: "translateY(-50%)",
          ...sideOffset,
          width: "48%",
          minWidth: 360,
          textAlign: side === "left" ? "right" : "left",
        }}
      >
        <span className="mono" style={{ fontSize: 18, color: t.color, fontWeight: 700, letterSpacing: "0.15em" }}>
          {t.year}
        </span>
        <h4 style={{ fontSize: 38, fontWeight: 800, color: "var(--tx)", margin: "12px 0 14px", lineHeight: 1.12 }}>
          {t.title}
        </h4>
        <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7 }}>{t.desc}</p>

        {images && images.length > 0 && (
          <div
            className="flex gap-4 mt-5"
            style={{ justifyContent: side === "left" ? "flex-end" : "flex-start" }}
          >
            {images.map((src) => (
              <div
                key={src}
                className="relative shrink-0 overflow-hidden rounded-sm"
                style={{ width: 260, height: 164, border: "1px solid rgba(0,0,0,0.1)" }}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="260px" />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function JourneyTimeline() {
  const outerRef = useRef<HTMLDivElement>(null);
  const outerTopRef = useRef(0);
  const outerHRef = useRef(0);
  const N = timelineData.length;
  const denom = N - 1 || 1;

  useLayoutEffect(() => {
    const measure = () => {
      if (!outerRef.current) return;
      outerTopRef.current = outerRef.current.getBoundingClientRect().top + window.scrollY;
      outerHRef.current = outerRef.current.offsetHeight;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollY } = useScroll();

  const progress = useTransform(scrollY, (sy) => {
    const outerH = outerHRef.current;
    if (!outerH) return 0;
    const vpH = window.innerHeight;
    const maxScroll = outerH - vpH;
    if (maxScroll <= 0) return 1;
    return Math.max(0, Math.min((sy - outerTopRef.current) / maxScroll, 1));
  });

  const hintOpacity = useTransform(progress, [0, 0.9, 1], [1, 1, 0]);

  // The traveled (colored) segment runs from center up to node 0's own
  // current position — clamped to the rail's top edge once that position
  // scrolls out of view, so the line reads as endless mid-journey but still
  // visibly starts at nothing when node 0 is the one sitting at center.
  // Same formula and same NODE_GAP_PCT as RailDot, so it can't fall out of
  // step with where the dots actually are.
  const traveledTop = useTransform(progress, (p) => Math.max(0, 50 - p * denom * NODE_GAP_PCT));
  const traveledHeight = useTransform(traveledTop, (v) => `${50 - v}%`);
  const traveledTopPct = useTransform(traveledTop, (v) => `${v}%`);

  const remainingBottom = useTransform(progress, (p) => Math.min(100, 50 + (denom - p * denom) * NODE_GAP_PCT));
  const remainingHeight = useTransform(remainingBottom, (v) => `${v - 50}%`);

  // Which entry is "arrived" — rounds to the nearest of N even slots along
  // progress, switching at the exact midpoint between two neighbors, so only
  // one entry's story is ever shown at once.
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const idx = Math.min(N - 1, Math.max(0, Math.round(p * denom)));
    setActiveIndex(idx);
  });
  const active = timelineData[activeIndex];
  const activeSide = activeIndex % 2 === 0 ? "right" : "left";

  return (
    <section className="relative z-2 py-14 px-3 sm:px-5">
    <div className="max-w-7xl mx-auto">

    {/* ── Desktop: scroll-driven "focus" timeline ─────────────────────── */}
    <div ref={outerRef} className="hidden md:block" style={{ height: `${(N + 1) * VH_PER_ENTRY}vh`, position: "relative" }}>
      <div className="sticky flex flex-col" style={{ top: 0, height: "100vh" }}>
        <Corner pos="tl" />
        <Corner pos="br" />

        <div className="flex items-center justify-between mb-4 px-2 pt-8 shrink-0">
          <p className="mono text-sm" style={{ color: "var(--em)", letterSpacing: "0.1em" }}>
            {"// my_journey[]"}
          </p>
          <p className="mono" style={{ fontSize: 12, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em" }}>
            {String(N).padStart(2, "0")} ENTRIES
          </p>
        </div>

        {/* Rail — dots and line both driven by the same progress → position
            formula, so they move at the same literal rate and never drift. */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            style={{
              position: "absolute", left: "50%", top: traveledTopPct, height: traveledHeight, width: 2,
              background: "var(--em)", transform: "translateX(-50%)",
            }}
          />
          <motion.div
            style={{
              position: "absolute", left: "50%", top: "50%", height: remainingHeight, width: 2,
              background: "rgba(0,0,0,0.12)", transform: "translateX(-50%)",
            }}
          />

          {timelineData.map((t, i) => (
            <RailDot key={t.year} t={t} i={i} N={N} progress={progress} activeIndex={activeIndex} />
          ))}

          <AnimatePresence>
            <ActiveEntry key={active.year} t={active} side={activeSide} />
          </AnimatePresence>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="flex items-center gap-1.5 mono self-end mt-3 shrink-0"
          style={{ opacity: hintOpacity, color: "rgba(0,0,0,0.35)", fontSize: 10 }}
        >
          scroll to continue
          <motion.span
            className="flex"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FiChevronDown size={12} />
          </motion.span>
        </motion.div>
      </div>
    </div>

    {/* ── Mobile: plain vertical timeline, no scroll-jacking ──────────── */}
    <div className="md:hidden">
      <div className="flex items-center justify-between mb-6">
        <p className="mono text-sm" style={{ color: "var(--em)", letterSpacing: "0.1em" }}>
          {"// my_journey[]"}
        </p>
        <p className="mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em" }}>
          {String(N).padStart(2, "0")} ENTRIES
        </p>
      </div>

      <div className="relative pl-7">
        <div style={{ position: "absolute", left: 4, top: 6, bottom: 6, width: 2, background: "rgba(0,0,0,0.12)" }} />
        {timelineData.map((t, i) => {
          const images = "images" in t ? t.images : undefined;
          return (
            <motion.div
              key={t.year}
              className="relative"
              style={{ paddingBottom: i === N - 1 ? 0 : 28 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
            >
              <div
                style={{
                  position: "absolute", left: -28, top: 4,
                  width: 11, height: 11, borderRadius: "50%",
                  border: `3px solid ${t.color}`, background: "var(--bg)",
                }}
              />
              <span className="mono" style={{ fontSize: 15, color: t.color, fontWeight: 700, letterSpacing: "0.1em" }}>
                {t.year}
              </span>
              <h4 style={{ fontSize: 24, fontWeight: 800, color: "var(--tx)", margin: "7px 0 9px", lineHeight: 1.2 }}>
                {t.title}
              </h4>
              <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.6 }}>{t.desc}</p>

              {images && images.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {images.map((src) => (
                    <div
                      key={src}
                      className="relative shrink-0 overflow-hidden rounded-sm"
                      style={{ width: 150, height: 94, border: "1px solid rgba(0,0,0,0.1)" }}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="150px" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>

    </div>
    </section>
  );
}
