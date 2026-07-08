"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { skills, categoryColors, type Skill } from "@/lib/data";
import DecoKeyboard, { type TechKey } from "@/components/DecoKeyboard";

// ─── Skill pill (used on both mobile and desktop) ─────────────────────────────
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
        background: "var(--surf)",
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
    <div style={{ width: 340, minHeight: 280, flexShrink: 0 }}>
      <AnimatePresence mode="wait">
        {tech ? (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, x: -20, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -12, y: 4 }}
            transition={{ duration: 0.20, ease: "easeOut" }}
          >
            <div style={{ marginBottom: 22 }}>
              {TechIcon
                ? <TechIcon size={64} style={{ color: tech.c, filter: `drop-shadow(0 0 28px color-mix(in srgb, ${tech.c} 55%, transparent))` }} />
                : tech.s
                  ? <Image src={tech.s} alt={tech.name} width={64} height={64} style={{ objectFit: "contain", filter: `drop-shadow(0 0 28px color-mix(in srgb, ${tech.c} 44%, transparent))` }} />
                  : null}
            </div>

            <div className="slabel" style={{ marginBottom: 10, color: tech.c }}>
              {tech.cat}
            </div>

            <h3 style={{
              fontSize: 44,
              fontWeight: 900,
              color: "var(--tx)",
              margin: "0 0 14px",
              lineHeight: 1,
              letterSpacing: "-0.025em",
            }}>
              {tech.name}
            </h3>

            <div style={{
              width: 52,
              height: 2,
              borderRadius: 1,
              background: `linear-gradient(90deg, ${tech.c}, transparent)`,
              marginBottom: 18,
            }} />

            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.78, margin: 0 }}>
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
            <div style={{ color: "color-mix(in srgb, var(--tx) 14%, transparent)", marginBottom: 18 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h4M18 14h.01" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: "color-mix(in srgb, var(--tx) 16%, transparent)", margin: "0 0 12px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              Hover a key
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, color: "color-mix(in srgb, var(--tx) 12%, transparent)" }}>
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
  const categories = Object.entries(skills);
  const [hoveredTech, setHoveredTech] = useState<TechKey | null>(null);

  return (
    <section id="skills" className="relative z-2">

      {/* heading */}
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

      {/* decorative keyboard + hover info panel — desktop only */}
      <motion.div
        className="hidden lg:flex relative max-w-7xl mx-auto px-3 sm:px-5 mb-16 items-center gap-8"
        style={{ height: 640 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <TechInfoPanel tech={hoveredTech} />
        <div className="relative flex-1 h-full">
          <DecoKeyboard onHover={setHoveredTech} />
        </div>
      </motion.div>

      {/* category pill/chip list — mobile only; desktop already has hover-a-key info panel */}
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
