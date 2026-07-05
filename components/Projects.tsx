"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FiArrowUpRight, FiGithub, FiArrowRight } from "react-icons/fi";
import { projects, getSkill, socialLinks, type Project } from "@/lib/data";
import { basePath } from "@/lib/basePath";

// ── Card dimensions & pile geometry ──────────────────────────────────────────
const CARD_W    = 400;
const CARD_H    = 510;
const PILE_SCALE  = 1;
const PILE_LEFT   = 56;
const PILE_STEP   = 28;
const PILE_Z_STEP = 7;   // per-card recession into the pile — real 3D depth, no tilt

// Card-thickness illusion during the flip — one set recedes behind the front
// face, a mirrored set (baked-in 180° rotation) recedes behind the back face,
// so real depth is visible through the whole rotation, not just half of it.
const DEPTH_STEPS  = [4, 8, 12, 16, 20] as const;
const DEPTH_COLORS = ["#eeeeea", "#e2e2dc", "#d6d6cf", "#cacac2", "#bebeb5"] as const;

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

  // Soft ambient elevation shadow — the card's cast shadow on the page, not its own
  // geometry, so it stays put while the card flips (see the depth layers below for that).
  // The colored glow only kicks in once the flip has actually finished (t >= P_FLIP_OK) —
  // showing it any earlier made it flash on mid-spin, before the front face even settled.
  const REST_SHADOW   = "0 20px 45px rgba(0,0,0,0.16), 0 8px 18px rgba(0,0,0,0.10)";
  const shadow = useTransform(progress, (p) => {
    if (p <= s0) return REST_SHADOW;
    const t = (p - s0) / seg;
    if (t >= P_FLIP_OK && t < 1)
      return `0 0 0 1px ${c}30, 0 30px 60px rgba(0,0,0,0.22), 0 0 80px ${c}35`;
    return REST_SHADOW;
  });

  // Specular sheen — a bright band that sweeps across the card as it rotates,
  // like light catching a real glossy surface turning in place. Parked off-frame
  // (opacity 0) whenever flipY is holding still, so it only appears mid-spin.
  const sheenX = useTransform(flipY, [180, 0], ["-220%", "220%"]);
  const sheenOpacity = useTransform(flipY, [180, 150, 90, 30, 0], [0, 1, 1, 1, 0]);

  // Cards stay perfectly upright — depth comes from translateZ recession into the pile, not tilt.
  const z = useTransform(progress, (p) => {
    if (p >= s0 && p <= s1) return 0;                    // active: front-most
    if (p > s1) return -Math.min(i, 10) * PILE_Z_STEP;    // left pile: recedes with each card
    return -Math.min(i, 10) * (PILE_Z_STEP * 0.5);        // right deck: slight recession
  });

  const zIndex = useTransform(progress, (p) => {
    if (p >= s0 && p <= s1) return N + 10;   // active: topmost
    if (p > s1) return i + 1;               // left pile
    return N - i;                            // right deck: card 0 on top
  });

  // Info panel fades in when card reaches center (P_ARRIVE) and fades out before leaving
  const infoOpacity = useTransform(progress, (p) => {
    if (p <= s0) return 0;
    const t = (p - s0) / seg;
    if (t < P_ARRIVE) return 0;
    if (t < P_ARRIVE + 0.08) return (t - P_ARRIVE) / 0.08;
    if (t > 0.85) return Math.max(0, (1 - t) / 0.15);
    return 1;
  });

  return (
    <>
    {/* Info panel — soft horizontal fade spanning the full sticky arena height, no boxed backdrop */}
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: 480,
        opacity: infoOpacity,
        zIndex: N + 5,
        pointerEvents: "none",
        background: "linear-gradient(to right, rgba(247,247,244,0.96) 0%, rgba(247,247,244,0.9) 38%, rgba(247,247,244,0.5) 68%, transparent 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 40px 0 40px",
      }}
    >
      <div className="slabel" style={{ marginBottom: 8, color: c }}>{project.sub}</div>
      <h2 style={{
        fontSize: "clamp(24px, 2.6vw, 38px)",
        fontWeight: 900,
        color: "#14140f",
        margin: "0 0 12px",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
      }}>
        {project.title}
      </h2>
      <div style={{
        width: 40, height: 2, borderRadius: 1,
        background: `linear-gradient(90deg, ${c}, transparent)`,
        marginBottom: 14,
        filter: `drop-shadow(0 0 6px ${c})`,
      }} />
      <p style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: 1.75, margin: 0 }}>
        {project.desc}
      </p>
    </motion.div>

    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: CARD_W,
        height: CARD_H,
        x,
        y: "-50%",
        z,
        scale,
        zIndex,
        opacity: 1,
        boxShadow: shadow,
        borderRadius: 24,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        willChange: "transform, box-shadow",
      }}
    >
      {/* Perspective context for the 3D flip */}
      <div style={{ position: "absolute", inset: 0, perspective: "1200px" }}>
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            rotateY: flipY,
            transformStyle: "preserve-3d",
          }}
        >

          {/* ── Depth layers — real card thickness, part of the same rotating
                group as the faces so it spins with the flip instead of sitting
                behind it as a flat, static shadow. Two sets, each culled via
                backfaceVisibility like its matching face: the plain set recedes
                behind the FRONT face for the first half of the flip, the
                180°-baked set recedes behind the BACK face for the second half —
                so thickness reads through the whole rotation, and neither set
                ever ends up floating in front of the face it's supposed to sit
                behind (a 180° flip inverts the sign of local translateZ). ── */}
          {DEPTH_STEPS.map((zd, idx) => (
            <div key={`f${idx}`} style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background: DEPTH_COLORS[idx],
              transform: `translateZ(-${zd}px)`,
              backfaceVisibility: "hidden",
            }} />
          ))}
          {DEPTH_STEPS.map((zd, idx) => (
            <div key={`b${idx}`} style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background: DEPTH_COLORS[idx],
              transform: `rotateY(180deg) translateZ(-${zd}px)`,
              backfaceVisibility: "hidden",
            }} />
          ))}

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
                  style={{ background: "linear-gradient(to top, rgba(10, 10, 10,.95) 0%, rgba(10, 10, 10,.12) 58%, transparent 100%)" }}
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
                  <h3 className="text-xl font-black leading-tight" style={{ color: "var(--tx)" }}>{project.title}</h3>
                  <span className="mono text-xs shrink-0 mt-1" style={{ color: "var(--muted)" }}>{project.year}</span>
                </div>
                <p
                  className="text-gray-600 leading-relaxed"
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

          {/* ── BACK face — illustrated card back (real image, not CSS shapes) ── */}
          <div style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 24,
            overflow: "hidden",
            background: "#0a0e1c",
          }}>
            <Image
              src={`${basePath}/images/card-back.svg`}
              alt=""
              fill
              className="object-cover"
              style={{ pointerEvents: "none" }}
            />
            {/* Surface sheen on back face */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none", borderRadius: 24,
              background: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 55%)",
            }} />
            {/* Series number — bottom-left, echoes the front face's counter */}
            <div style={{
              position: "absolute", bottom: 28, left: 28,
              fontSize: 10, fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", whiteSpace: "nowrap" as const,
            }}>
              NO. {String(i + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
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

        {/* Specular sheen sweep — sits outside the rotating group so it always
            faces the viewer flat-on; only its position/opacity are driven by
            the flip, so the "light" visibly tracks the spin instead of a
            static highlight that ignores it. */}
        <motion.div
          className="pointer-events-none"
          style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", opacity: sheenOpacity, zIndex: 20 }}
        >
          <motion.div
            style={{
              position: "absolute", top: "-30%", bottom: "-30%", width: "45%",
              background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              x: sheenX,
              mixBlendMode: "overlay",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
    </>
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
            style={{ background: "linear-gradient(to top, rgba(10, 10, 10,.95) 0%, rgba(10, 10, 10,.1) 60%, transparent 100%)" }}
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
            <h3 className="text-base font-bold leading-tight" style={{ color: "var(--tx)" }}>{project.title}</h3>
            <span className="mono text-[10px] shrink-0" style={{ color: "var(--muted)" }}>{project.year}</span>
          </div>
          <p
            className="text-gray-600 leading-relaxed"
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

  // 10% dark overlay for the entire sticky panel — fades in when any card is at center
  const overlayOpacity = useTransform(progress, (p) => {
    const seg = 1 / N;
    for (let i = 0; i < N; i++) {
      const s0 = i * seg;
      if (p < s0 || p > s0 + seg) continue;
      const t = (p - s0) / seg;
      if (t < P_ARRIVE - 0.08) return 0;
      if (t < P_ARRIVE) return ((t - (P_ARRIVE - 0.08)) / 0.08) * 0.10;
      if (t > 0.87) return Math.max(0, (0.90 - t) / 0.03) * 0.10;
      return 0.10;
    }
    return 0;
  });

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
                Featured <span className="gtx">Projects</span>
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                From web, mobile, to data — built with genuine care.
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

          {/* 10% dark overlay — covers entire sticky panel when a card is at center */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.10)",
              opacity: overlayOpacity,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Card arena — perspective here gives cards their rotateX 3D depth */}
          <div style={{ position: "relative", height: "calc(100vh - 156px)", overflow: "hidden", perspective: "1400px", perspectiveOrigin: "50% 50%" }}>
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
            style={{ height: 2, background: "rgba(0,0,0,0.06)" }}
          >
            <motion.div
              style={{ height: "100%", width: progressW, background: "linear-gradient(90deg, #ff6a00, #b34700)" }}
            />
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-6 right-8 flex items-center gap-2 mono"
            style={{ opacity: hintOpacity, color: "rgba(0,0,0,0.35)", fontSize: 11 }}
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
            <h2 className="text-3xl font-black">Featured <span className="gtx">Projects</span></h2>
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
