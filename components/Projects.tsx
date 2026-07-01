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
const PILE_SCALE  = 1;      // cards stay full size in the pile
const PILE_LEFT   = 56;     // px from left edge of screen to first piled card
const PILE_STEP   = 28;     // px between consecutive piled cards (left-edge offset)
// Subtle rotation each card gets once in the pile
const PILE_ROT  = [-2.5, 1, -1.8, 2.2, -0.6, 1.4, -2.0, 0.8];

// ── Easing helpers ────────────────────────────────────────────────────────────
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn  = (t: number) => t * t * t;

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
  const s0  = i * seg;   // segment start
  const s1  = s0 + seg;  // segment end

  // Horizontal position: off-screen right → center → pile
  const x = useTransform(progress, (p) => {
    if (typeof window === "undefined") return 2000;
    const vw = window.innerWidth;
    const cx = (vw - CARD_W) / 2;            // centered left edge
    const px = PILE_LEFT + i * PILE_STEP;    // pile left edge

    if (p <= s0) return vw + CARD_W;         // not yet appeared
    if (p >= s1) return px;                  // settled in pile

    const t = (p - s0) / seg;
    if (t < 0.46) {
      // Enter: right → center
      return vw + CARD_W + (cx - (vw + CARD_W)) * easeOut(t / 0.46);
    }
    // Exit: center → pile
    return cx + (px - cx) * easeIn((t - 0.46) / 0.54);
  });

  const scale = useTransform(progress, (p) => {
    if (p <= s0) return 0.88;
    if (p >= s1) return PILE_SCALE;
    const t = (p - s0) / seg;
    if (t < 0.46) return 0.88 + (1 - 0.88) * easeOut(t / 0.46);
    return 1 + (PILE_SCALE - 1) * easeIn((t - 0.46) / 0.54);
  });

  // Rotation: 0 while active, pile tilt when settled
  const rotate = useTransform(progress, (p) => {
    if (p >= s1) return PILE_ROT[i % PILE_ROT.length];
    return 0;
  });

  // Z-index: highest while active, stack order in pile
  const zIndex = useTransform(progress, (p) => {
    if (p >= s0 && p <= s1) return N + 10;
    if (p > s1) return i + 1;
    return 0;
  });

  // Fade in on first appearance
  const opacity = useTransform(progress, (p) => {
    if (p <= s0) return 0;
    if (p >= s0 + seg * 0.07) return 1;
    return (p - s0) / (seg * 0.07);
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
        scale,
        rotate,
        zIndex,
        opacity,
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
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
              fontSize: 10, color: project.color,
              background: "rgba(0,0,0,.65)", padding: "3px 11px",
              borderRadius: 999, border: `1px solid ${project.color}45`,
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

  // Measure the outer container once (and on resize) for jitter-free sticky math
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

  // y that exactly counteracts scroll — keeps inner panel visually pinned (no CSS sticky quirks)
  const innerY = useTransform(scrollY, (sy) => {
    const outerH = outerHRef.current;
    if (!outerH) return 0;
    const vpH     = window.innerHeight;
    return Math.max(0, Math.min(sy - outerTopRef.current, outerH - vpH));
  });

  // Normalised [0,1] progress within the section — drives all card animations
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
        {/* Pinned viewport — JS sticky so it works regardless of ancestor transforms */}
        <motion.div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "100vh",
            y: innerY,
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

          {/* Card arena — cards float here, centered vertically */}
          <div style={{ position: "relative", height: "calc(100vh - 156px)", overflow: "hidden" }}>
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
        </motion.div>
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
