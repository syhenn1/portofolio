"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FiArrowUpRight, FiGithub, FiArrowRight } from "react-icons/fi";
import { projects, getSkill, socialLinks, type Project } from "@/lib/data";

// ── Card dimensions & pile geometry ──────────────────────────────────────────
const CARD_W    = 400;
const CARD_H    = 510;
const PILE_SCALE  = 1;
const PILE_LEFT   = 56;
const PILE_STEP   = 28;
const PILE_ROT  = [-2.5, 1, -1.8, 2.2, -0.6, 1.4, -2.0, 0.8];

// ── Easing helpers ────────────────────────────────────────────────────────────
const easeOut   = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn    = (t: number) => t * t * t;
const easeInOut = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

// ── Phase fractions within each card's scroll segment ────────────────────────
const P_ARRIVE  = 0.38;   // card reaches center (back face visible while sliding)
const P_FLIP_OK = 0.63;   // flip completes (front face revealed)

// ── Desktop stacked card ──────────────────────────────────────────────────────
function StackCard({
  project, i, N, progress,
}: {
  project: Project;
  i: number;
  N: number;
  progress: MotionValue<number>;
}) {
  const techs = project.tech.slice(0, 4).map((k) => getSkill(k)).filter(Boolean);
  const seg = 1 / N;
  const s0  = i * seg;
  const s1  = s0 + seg;
  const c   = project.color;

  // All cards start VISIBLE in a right-side deck (not off-screen).
  // Phase 1 (0 → P_ARRIVE):  slide from right deck to center — back face showing
  // Phase 2 (P_ARRIVE → P_FLIP_OK): hold at center, flip to front face
  // Phase 3 (P_FLIP_OK → 1.0): slide from center to left pile

  const x = useTransform(progress, (p) => {
    if (typeof window === "undefined") return 2000;
    const vw = window.innerWidth;
    const cx = (vw - CARD_W) / 2;
    const px = PILE_LEFT + i * PILE_STEP;
    // Right-side deck: card 0 is frontmost (rightmost); each card behind steps 5 px left
    const rx = vw - CARD_W - 44 - Math.min(i * 5, 24);

    if (p <= s0) return rx;   // resting in right-side deck, always visible
    if (p >= s1) return px;

    const t = (p - s0) / seg;
    if (t < P_ARRIVE) {
      return rx + (cx - rx) * easeOut(t / P_ARRIVE);
    } else if (t < P_FLIP_OK) {
      return cx;
    } else {
      return cx + (px - cx) * easeIn((t - P_FLIP_OK) / (1 - P_FLIP_OK));
    }
  });

  // 3D flip: 180° (back face) → 0° (front face), eased through center pause
  const flipY = useTransform(progress, (p) => {
    if (p <= s0) return 180;
    const t = (p - s0) / seg;
    if (t <= P_ARRIVE)  return 180;
    if (t >= P_FLIP_OK) return 0;
    return 180 * (1 - easeInOut((t - P_ARRIVE) / (P_FLIP_OK - P_ARRIVE)));
  });

  const scale = useTransform(progress, (p) => {
    if (p <= s0) return 0.92;   // slightly smaller in the resting deck
    if (p >= s1) return PILE_SCALE;
    const t = (p - s0) / seg;
    if (t < P_ARRIVE) return 0.92 + (1 - 0.92) * easeOut(t / P_ARRIVE);
    return 1;
  });

  // Multi-layer shadow: card edge (thickness illusion) + lanyard-style drop shadow
  const EDGE = "0 2px 0 rgba(0,0,0,0.98), 0 4px 0 rgba(0,0,0,0.80), 0 6px 0 rgba(0,0,0,0.50)";
  const shadow = useTransform(progress, (p) => {
    if (p <= s0) return `${EDGE}, 0 16px 48px rgba(0,0,0,0.65), 0 40px 90px rgba(0,0,0,0.45)`;
    const t = (p - s0) / seg;
    if (t >= P_ARRIVE && t < 1)
      return `${EDGE}, 0 0 0 1px ${c}30, 0 16px 60px rgba(0,0,0,0.75), 0 0 80px ${c}44, 0 50px 120px rgba(0,0,0,0.60)`;
    return `${EDGE}, 0 16px 48px rgba(0,0,0,0.65), 0 40px 90px rgba(0,0,0,0.45)`;
  });

  // Slight tilt in right deck, straightens as it animates to center, settles to pile tilt
  const rotate = useTransform(progress, (p) => {
    if (p >= s1) return PILE_ROT[i % PILE_ROT.length];
    if (p <= s0)  return PILE_ROT[i % PILE_ROT.length] * 0.5;
    const t = (p - s0) / seg;
    if (t < P_ARRIVE) return PILE_ROT[i % PILE_ROT.length] * 0.5 * (1 - t / P_ARRIVE);
    return 0;
  });

  const zIndex = useTransform(progress, (p) => {
    if (p >= s0 && p <= s1) return N + 10;   // active: topmost
    if (p > s1) return i + 1;               // left pile
    return N - i;                            // right deck: card 0 on top
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: CARD_W,
        height: CARD_H,
        x,
        y: "-50%",
        rotateX: -6,
        scale,
        rotate,
        zIndex,
        opacity: 1,
        boxShadow: shadow,
        borderRadius: 24,
        transformOrigin: "center center",
        willChange: "transform, box-shadow",
      }}
    >
      {/* Perspective context for the 3D flip — must be a plain div, not motion.div,
          so that `perspective` maps to the CSS property (not a transform function) */}
      <div style={{ perspective: "1200px", width: "100%", height: "100%" }}>
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            rotateY: flipY,
            transformStyle: "preserve-3d",
          }}
        >

          {/* ── FRONT face ─────────────────────────────────────────────── */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 24, overflow: "hidden" }}>
            {/* Surface sheen — light reflection like the lanyard card */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none", borderRadius: 24,
              background: "linear-gradient(155deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 30%, transparent 55%)",
            }} />
            <Link href={`/projects/${project.slug}`} className="proj-card group flex flex-col h-full">
              {/* Thumbnail */}
              <div className="relative shrink-0" style={{ height: "52%" }}>
                <Image src={project.img} alt={project.title} fill className="proj-img object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(14,9,5,.95) 0%, rgba(14,9,5,.12) 58%, transparent 100%)" }}
                />
                <span
                  className="mono absolute top-3 left-3"
                  style={{
                    fontSize: 10, color: c,
                    background: "rgba(0,0,0,.65)", padding: "3px 11px",
                    borderRadius: 999, border: `1px solid ${c}45`,
                  }}
                >
                  {project.sub}
                </span>
                <div className="proj-arrow absolute top-3 right-3">
                  <FiArrowUpRight size={18} />
                </div>
                <span className="mono absolute bottom-3 right-4" style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
                  {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </span>
              </div>
              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black text-white leading-tight">{project.title}</h3>
                  <span className="mono text-xs shrink-0 mt-1" style={{ color: "#475569" }}>{project.year}</span>
                </div>
                <p
                  className="text-gray-400 leading-relaxed"
                  style={{ fontSize: 13, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {techs.map((s, idx) => {
                    const skill = s!;
                    const SkillIcon = skill.Icon;
                    return (
                      <span key={idx} className="ttag">
                        {SkillIcon
                          ? <SkillIcon size={11} />
                          : <Image src={skill.src!} alt={skill.name} width={11} height={11} style={{ objectFit: "contain" }} />}
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          </div>

          {/* ── BACK face (YuGiOh-style card back) ─────────────────────── */}
          <div style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 24,
            overflow: "hidden",
            background: "linear-gradient(135deg, #0e0620 0%, #180430 40%, #0a0e1c 80%, #060a14 100%)",
          }}>
            {/* Surface sheen on back face */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none", borderRadius: 24,
              background: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 55%)",
            }} />
            {/* Diamond cross-hatch */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 14px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 14px)
              `,
            }} />
            {/* Oval ornament */}
            <div style={{
              position: "absolute",
              inset: "13%",
              borderRadius: "50%",
              border: `1px solid ${c}28`,
              boxShadow: `0 0 40px ${c}14 inset`,
            }} />
            {/* RS monogram */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontSize: 132,
                fontWeight: 900,
                color: "rgba(255,255,255,0.038)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                userSelect: "none",
              }}>RS</span>
            </div>
            {/* Top badge */}
            <div style={{
              position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
              padding: "4px 18px", borderRadius: 999,
              border: `1px solid ${c}55`, background: `${c}18`,
              fontSize: 10, fontFamily: "var(--font-mono)", color: c,
              letterSpacing: "0.12em", fontWeight: 700,
              textTransform: "uppercase" as const, whiteSpace: "nowrap" as const,
            }}>PORTFOLIO</div>
            {/* Bottom label */}
            <div style={{
              position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.22)", letterSpacing: "0.08em", whiteSpace: "nowrap" as const,
            }}>RIFAT SYAHMAN</div>
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 20, left: 20, width: 26, height: 26, borderTop: `2px solid ${c}80`, borderLeft: `2px solid ${c}80` }} />
            <div style={{ position: "absolute", top: 20, right: 20, width: 26, height: 26, borderTop: `2px solid ${c}80`, borderRight: `2px solid ${c}80` }} />
            <div style={{ position: "absolute", bottom: 20, left: 20, width: 26, height: 26, borderBottom: `2px solid ${c}80`, borderLeft: `2px solid ${c}80` }} />
            <div style={{ position: "absolute", bottom: 20, right: 20, width: 26, height: 26, borderBottom: `2px solid ${c}80`, borderRight: `2px solid ${c}80` }} />
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Mobile card ────────────────────────────────────────────────────────────────
function MobileProjectCard({ project, i }: { project: Project; i: number }) {
  const techs = project.tech.slice(0, 4).map((k) => getSkill(k)).filter(Boolean);

  return (
    <motion.div
      className="snap-carousel-item"
      initial={{ opacity: 0, scale: 0.93 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: i * 0.05 }}
    >
      <Link href={`/projects/${project.slug}`} className="proj-card group h-full flex flex-col">
        <div className="relative shrink-0 h-44">
          <Image src={project.img} alt={project.title} fill className="proj-img object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(14,9,5,.95) 0%, rgba(14,9,5,.1) 60%, transparent 100%)" }}
          />
          <span
            className="mono absolute top-3 left-3"
            style={{
              fontSize: 10, color: project.color,
              background: "rgba(0,0,0,.7)", padding: "3px 10px",
              borderRadius: 999, border: `1px solid ${project.color}45`,
            }}
          >
            {project.sub}
          </span>
          <div className="proj-arrow absolute top-3 right-3"><FiArrowUpRight size={16} /></div>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white leading-tight">{project.title}</h3>
            <span className="mono text-[10px] shrink-0" style={{ color: "#475569" }}>{project.year}</span>
          </div>
          <p
            className="text-gray-400 leading-relaxed"
            style={{ fontSize: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {techs.map((s, idx) => {
              const skill = s!;
              const SkillIcon = skill.Icon;
              return (
                <span key={idx} className="ttag" style={{ fontSize: 10 }}>
                  {SkillIcon
                    ? <SkillIcon size={10} />
                    : <Image src={skill.src!} alt={skill.name} width={10} height={10} style={{ objectFit: "contain" }} />}
                  {skill.name}
                </span>
              );
            })}
            {project.tech.length > techs.length && (
              <span className="ttag" style={{ fontSize: 10 }}>+{project.tech.length - techs.length}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Projects section ───────────────────────────────────────────────────────────
export default function Projects() {
  const outerRef    = useRef<HTMLDivElement>(null);
  const outerTopRef = useRef(0);
  const outerHRef   = useRef(0);
  const N = projects.length;
  const sectionH = `${(N + 1) * 100}vh`;

  // Measure once (and on resize) — refs read by both the scroll handler and progress transform
  useLayoutEffect(() => {
    const measure = () => {
      if (!outerRef.current) return;
      outerTopRef.current = outerRef.current.getBoundingClientRect().top + window.scrollY;
      outerHRef.current   = outerRef.current.offsetHeight;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollY } = useScroll();

  // Normalised [0,1] progress — drives all card animations
  const progress = useTransform(scrollY, (sy) => {
    const outerH = outerHRef.current;
    if (!outerH) return 0;
    const vpH      = window.innerHeight;
    const maxScroll = outerH - vpH;
    if (!maxScroll) return 0;
    return Math.max(0, Math.min((sy - outerTopRef.current) / maxScroll, 1));
  });

  const progressW   = useTransform(progress, [0, 1], ["0%", "100%"]);
  const hintOpacity = useTransform(progress, [0, 0.04], [1, 0]);

  return (
    <section id="projects" className="relative z-2">

      {/* ── Desktop: stacked-card carousel ──────────────────────────────── */}
      <div
        ref={outerRef}
        className="hidden md:block"
        style={{ height: sectionH, position: "relative" }}
      >
        {/* CSS sticky panel — browser compositor handles it, perfectly in sync with card RAF updates */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <motion.div
            className="flex items-end justify-between px-8 pt-14 pb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
          >
            <div>
              <div className="slabel mb-3">featured work</div>
              <h2 className="text-3xl sm:text-5xl font-black">
                Projects <span className="gtx">Unggulan</span>
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Dari web, mobile, hingga data — dibangun dengan sungguh-sungguh.
              </p>
            </div>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm shrink-0"
            >
              <FiGithub size={16} />
              All on GitHub
            </a>
          </motion.div>

          {/* Card arena — perspective here gives cards their rotateX 3D depth */}
          <div style={{ position: "relative", height: "calc(100vh - 156px)", overflow: "hidden", perspective: "2200px", perspectiveOrigin: "50% 50%" }}>
            {projects.map((project, i) => (
              <StackCard
                key={project.slug}
                project={project}
                i={i}
                N={N}
                progress={progress}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 2, background: "rgba(255,255,255,0.05)" }}
          >
            <motion.div
              style={{ height: "100%", width: progressW, background: "linear-gradient(90deg, #cc0000, #ff6b35)" }}
            />
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-6 right-8 flex items-center gap-2 mono"
            style={{ opacity: hintOpacity, color: "rgba(255,255,255,0.25)", fontSize: 11 }}
          >
            scroll to explore
            <FiArrowRight size={12} />
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: horizontal snap carousel ────────────────────────────── */}
      <div className="md:hidden py-14 px-3 sm:px-5">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="slabel mb-2">featured work</div>
            <h2 className="text-3xl font-black">Projects <span className="gtx">Unggulan</span></h2>
          </div>
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm mt-4 sm:mt-0 self-start">
            <FiGithub size={14} /> GitHub
          </a>
        </motion.div>

        <div className="snap-carousel">
          {projects.map((project, i) => (
            <MobileProjectCard key={project.slug} project={project} i={i} />
          ))}
        </div>
      </div>

    </section>
  );
}
