"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { skills, categoryColors, type Skill } from "@/lib/data";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { TechKey } from "@/components/MechanicalKeyboard3D";
import { useInView } from "@/lib/useInView";

const MechanicalKeyboard3D = dynamic(
  () => import("@/components/MechanicalKeyboard3D"),
  { ssr: false },
);

// ─── Mobile skill pill ─────────────────────────────────────────────────────────
function SkillPill({ skill, color, index }: {
  skill: Skill; color: string; index: number;
}) {
  const Icon = skill.Icon;
  return (
    <motion.div
      className="inline-flex items-center gap-2 select-none"
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        background: "#fff",
        border: `1px solid ${color}30`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.02, duration: 0.25, ease: "easeOut" }}
    >
      {Icon ? (
        <Icon size={15} style={{ color, flexShrink: 0 }} />
      ) : (
        <Image src={skill.src!} alt="" width={15} height={15} style={{ objectFit: "contain", flexShrink: 0 }} />
      )}
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)", whiteSpace: "nowrap" }}>
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── Tech info panel (desktop) — hero-style, no container ────────────────────
function TechInfoPanel({ tech }: { tech: TechKey | null }) {
  const TechIcon = tech?.I;
  return (
    <div style={{ width: 420, minHeight: 280 }}>
      <AnimatePresence mode="wait">
        {tech ? (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, x: -20, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -12, y: 4 }}
            transition={{ duration: 0.20, ease: "easeOut" }}
          >
            {/* Large floating icon — no background box */}
            <div style={{ marginBottom: 22 }}>
              {TechIcon
                ? <TechIcon size={76} style={{ color: tech.c, filter: `drop-shadow(0 0 28px ${tech.c}55)` }} />
                : tech.s
                  ? <Image src={tech.s} alt={tech.name} width={76} height={76} style={{ objectFit: "contain", filter: `drop-shadow(0 0 28px ${tech.c}44)` }} />
                  : null}
            </div>

            {/* Category — hero slabel style */}
            <div className="slabel" style={{ marginBottom: 10, color: tech.c }}>
              {tech.cat}
            </div>

            {/* Large name */}
            <h3 style={{
              fontSize: 58,
              fontWeight: 900,
              color: "var(--tx)",
              margin: "0 0 14px",
              lineHeight: 1,
              letterSpacing: "-0.025em",
            }}>
              {tech.name}
            </h3>

            {/* Accent line */}
            <div style={{
              width: 52,
              height: 2,
              borderRadius: 1,
              background: `linear-gradient(90deg, ${tech.c}, transparent)`,
              marginBottom: 18,
            }} />

            {/* Description */}
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.78, margin: 0 }}>
              {tech.desc}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ color: "rgba(0,0,0,0.14)", marginBottom: 18 }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h4M18 14h.01" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,0.16)", margin: "0 0 12px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              Hover a key
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "rgba(0,0,0,0.12)" }}>
              Colored keycaps are tech tools.<br />Hover them to see details.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skills section ───────────────────────────────────────────────────────────
export default function Skills() {
  const [hoveredTech, setHoveredTech] = useState<TechKey | null>(null);
  const categories = Object.entries(skills);
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // Unmount the canvas once scrolled well away — Hero and Projects each mount their
  // own Lanyard (WebGL + Rapier), and stacking several persistent 3D contexts at once
  // is what blows past the browser's live WebGL-context budget (see Lanyard.tsx).
  const inView = useInView(sectionRef, "300px 0px 300px 0px");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const kbOpacity = useTransform(scrollYProgress, [0, 0.12, 0.78, 1.0], [0, 1, 1, 0]);

  // Spin is driven inside Three.js (no CSS rotateY on canvas ancestor — that breaks drei Html overlays)
  // Spins in from the right on enter, spins out to the right on exit
  const introRotYRef = useRef<number>(Math.PI / 2);
  useEffect(() => {
    const getSpinY = (val: number) => {
      if (val < 0.20) return (1 - val / 0.20) * (Math.PI / 2);       // spin in
      if (val > 0.78) return ((val - 0.78) / 0.22) * (Math.PI / 2);  // spin out
      return 0;
    };
    introRotYRef.current = getSpinY(scrollYProgress.get());
    return scrollYProgress.on("change", (val: number) => {
      introRotYRef.current = getSpinY(val);
    });
  }, [scrollYProgress]);

  return (
    // overflow-hidden removed — drei Html icon overlays are DOM elements clipped by it
    <section ref={sectionRef} id="skills" className="relative z-2">

      {/* heading — stays inside the normal padding */}
      <div className="max-w-7xl mx-auto pt-14 px-3 sm:px-5">
        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3">tech stack</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Tools & <span className="gtx">Technology</span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm">The tools I use to build products.</p>
        </motion.div>
      </div>

      {/* ── desktop: scroll-driven fade; spin is inside Three.js so Html icons stay correct ── */}
      <motion.div
        className="hidden lg:block relative"
        style={{ height: "80vh", minHeight: 680, opacity: kbOpacity }}
      >
        {/* Info panel — flat, no CSS 3D transform on it */}
        <motion.div
          className="absolute z-10"
          style={{ left: "clamp(24px, 4vw, 80px)", top: "50%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <TechInfoPanel tech={hoveredTech} />
        </motion.div>

        {/* No CSS perspective/rotateY wrapper here — drei Html overlays break under CSS 3D transforms.
            Mount gated by JS media query, not just the `hidden lg:block` above — a display:none
            canvas still runs its WebGL render loop, which was piling onto the mobile crash. */}
        {isDesktop && inView && (
          <MechanicalKeyboard3D onHover={setHoveredTech} introRotY={introRotYRef} />
        )}
      </motion.div>

        {/* ── mobile: pill/chip list by category ────────────────────────── */}
        <div className="lg:hidden space-y-7 px-3 sm:px-5 pb-14 max-w-7xl mx-auto">
          {categories.map(([cat, items], i) => {
            const color = categoryColors[cat] || "#10b981";
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div className="flex items-center gap-2 mb-3.5">
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: color }} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.07em" }}>
                    {cat}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(items).map(([key, skill], j) => (
                    <SkillPill key={key} skill={skill} color={color} index={j} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

    </section>
  );
}
