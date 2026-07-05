"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { timelineData } from "@/lib/data";

const TRAVEL_PX = 150;

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

// Signed distance (in "segments") from entry i's own focus point — 0 when centered,
// growing as scroll carries it away. Pinned at 0 before the first entry's turn and
// after the last entry's turn, so those two never drift out of focus.
function localProgress(p: number, i: number, N: number) {
  const segCenter = (i + 0.5) / N;
  let lp = (p - segCenter) * N;
  if (i === 0 && lp < 0) lp = 0;
  if (i === N - 1 && lp > 0) lp = 0;
  return lp;
}

function TravelingEntry({
  t, i, N, progress,
}: {
  t: (typeof timelineData)[number];
  i: number;
  N: number;
  progress: MotionValue<number>;
}) {
  const side = i % 2 === 0 ? "right" : "left";
  const sideOffset = side === "left" ? { right: "56%" } : { left: "56%" };
  const images = "images" in t ? t.images : undefined;

  const lp = useTransform(progress, (p) => localProgress(p, i, N));
  const y = useTransform(lp, (v) => -v * TRAVEL_PX);
  const opacity = useTransform(lp, (v) => {
    const a = Math.abs(v);
    if (a < 0.35) return 1;
    if (a > 1.1) return 0;
    return 1 - (a - 0.35) / 0.75;
  });
  const dotScale = useTransform(opacity, (o) => 0.65 + o * 0.75);

  return (
    <div className="absolute left-0 right-0 top-1/2" style={{ transform: "translateY(-50%)" }}>
      <motion.div className="relative" style={{ y, opacity }}>
        <motion.div
          className="absolute left-1/2 top-0"
          style={{
            translateX: "-50%", translateY: "-50%", scale: dotScale,
            width: 17, height: 17, border: `3px solid ${t.color}`, background: t.color,
          }}
        />
        <div
          className="absolute top-0"
          style={{
            transform: "translateY(-50%)",
            ...sideOffset,
            width: "46%",
            minWidth: 300,
            textAlign: side === "left" ? "right" : "left",
          }}
        >
          <span className="mono" style={{ fontSize: 15, color: t.color, fontWeight: 700, letterSpacing: "0.15em" }}>
            {t.year}
          </span>
          <h4 style={{ fontSize: 26, fontWeight: 800, color: "var(--tx)", margin: "8px 0 10px", lineHeight: 1.15 }}>
            {t.title}
          </h4>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>{t.desc}</p>

          {images && images.length > 0 && (
            <div
              className="flex gap-2.5 mt-4"
              style={{ justifyContent: side === "left" ? "flex-end" : "flex-start" }}
            >
              {images.map((src) => (
                <div
                  key={src}
                  className="relative shrink-0 overflow-hidden rounded-sm"
                  style={{ width: 120, height: 76, border: "1px solid rgba(0,0,0,0.1)" }}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function JourneyTimeline() {
  const outerRef = useRef<HTMLDivElement>(null);
  const outerTopRef = useRef(0);
  const outerHRef = useRef(0);
  const N = timelineData.length;

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

  return (
    <section className="relative z-2 py-14 px-3 sm:px-5">
    <div className="max-w-7xl mx-auto">

    {/* ── Desktop: scroll-driven "focus" timeline ─────────────────────── */}
    <div ref={outerRef} className="hidden md:block" style={{ height: `${(N + 1) * 100}vh`, position: "relative" }}>
      <div className="sticky flex flex-col" style={{ top: 60, height: "min(90vh, 760px)" }}>
        <Corner pos="tl" />
        <Corner pos="br" />

        <div className="flex items-center justify-between mb-4 px-2 pt-1 shrink-0">
          <p className="mono text-sm" style={{ color: "var(--em)", letterSpacing: "0.1em" }}>
            // my_journey[]
          </p>
          <p className="mono" style={{ fontSize: 12, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em" }}>
            {String(N).padStart(2, "0")} ENTRIES
          </p>
        </div>

        {/* Focus stage — centered line; only the active node + entry sit in focus,
            the rest travel past above/below as you scroll. */}
        <div className="relative flex-1 overflow-hidden">
          <div style={{ position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 2, background: "rgba(0,0,0,0.12)", transform: "translateX(-50%)" }} />
          <motion.div
            style={{
              position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 2,
              background: "var(--em)", scaleY: progress, transformOrigin: "top", transform: "translateX(-50%)",
            }}
          />
          {timelineData.map((t, i) => (
            <TravelingEntry key={t.year} t={t} i={i} N={N} progress={progress} />
          ))}
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
          // my_journey[]
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
              <span className="mono" style={{ fontSize: 13, color: t.color, fontWeight: 700, letterSpacing: "0.1em" }}>
                {t.year}
              </span>
              <h4 style={{ fontSize: 19, fontWeight: 800, color: "var(--tx)", margin: "5px 0 7px", lineHeight: 1.2 }}>
                {t.title}
              </h4>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{t.desc}</p>

              {images && images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((src) => (
                    <div
                      key={src}
                      className="relative shrink-0 overflow-hidden rounded-sm"
                      style={{ width: 108, height: 68, border: "1px solid rgba(0,0,0,0.1)" }}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="108px" />
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
