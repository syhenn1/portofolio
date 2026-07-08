"use client";

import { useRef, useLayoutEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { projects, getSkill, socialLinks, SCROLL_VH_PER_ITEM, type Project } from "@/lib/data";
import ProjectCardDeck from "@/components/ProjectCardDeck";
import LearnMoreButton from "@/components/LearnMoreButton";
import { getLenisInstance } from "@/lib/lenis";

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
  const router      = useRouter();
  const outerRef    = useRef<HTMLDivElement>(null);
  const outerTopRef = useRef(0);
  const outerHRef   = useRef(0);
  const N = projects.length;

  const [zoom, setZoom] = useState(1);
  useLayoutEffect(() => {
    const computedZoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
    setZoom(computedZoom);
  }, []);

  const sectionH = `${((N + 0.5) * SCROLL_VH_PER_ITEM) / zoom}vh`;

  // The info panel sits on top of (and blocks clicks into) the pile of past
  // cards behind it — fade it out of the way whenever the cursor drifts
  // toward that left-hand zone, so the pile stays reachable.
  const [hoverPileZone, setHoverPileZone] = useState(false);
  const handleArenaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoverPileZone(e.clientX - e.currentTarget.getBoundingClientRect().left < 520);
  };

  // Clicking a piled (already-passed) card scrolls the section back to bring
  // that project into focus at center first, then hands off to its case
  // study — instead of jumping straight there from a small, off-to-the-side card.
  const focusAndGo = useCallback((index: number, href: string) => {
    const vpHCSS = window.innerHeight / zoom;
    const maxScrollCSS = outerHRef.current - vpHCSS;
    const lenis = getLenisInstance();
    if (lenis && maxScrollCSS > 0) {
      const targetY = outerTopRef.current + (((index + 0.5) / N) * maxScrollCSS) * zoom;
      lenis.scrollTo(targetY, { duration: 1.1, onComplete: () => router.push(href) });
    } else {
      router.push(href);
    }
  }, [N, router, zoom]);

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
    // Re-measure once `zoom` is corrected from its default (1) — otherwise this
    // can run before the zoom-compensated section height has actually rendered,
    // caching a too-tall height and desyncing scroll progress from real scroll.
  }, [zoom]);

  const { scrollY } = useScroll();

  // Normalised [0,1] progress — which project segment we're scrolled through (zoom-calibrated to layout CSS pixels)
  const progress = useTransform(scrollY, (sy) => {
    const outerH = outerHRef.current;
    if (!outerH) return 0;
    const vpHCSS      = window.innerHeight / zoom;
    const maxScrollCSS = outerH - vpHCSS;
    if (maxScrollCSS <= 0) return 0;
    
    const syCSS = sy / zoom;
    const topCSS = outerTopRef.current / zoom;
    return Math.max(0, Math.min((syCSS - topCSS) / maxScrollCSS, 1));
  });

  const progressW   = useTransform(progress, [0, 1], ["0%", "100%"]);
  const hintOpacity = useTransform(progress, [0, 0.04], [1, 0]);

  // Which project is currently sweeping through center — drives both the info
  // panel's text and (via `sweep` below) the deck's right→center→left motion.
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    setActiveIndex(idx);
  });
  const active = projects[activeIndex];
  const techs = active.tech.slice(0, 4).map((k) => getSkill(k)).filter(Boolean);

  // 0→1 within the active project's own segment — resets at each segment
  // boundary, driving the active card's right→center→left slide (see ProjectCardDeck).
  const sweep = useTransform(progress, (p) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    const s0 = idx / N;
    return Math.min(1, Math.max(0, (p - s0) * N));
  });

  return (
    <section id="projects" className="relative z-2">

      {/* ── Desktop: Comet card deck, scroll sweeps right → center → left ──── */}
      <div
        ref={outerRef}
        className="hidden md:block"
        style={{ height: sectionH, position: "relative" }}
      >
        {/* CSS sticky panel — browser compositor handles it, perfectly in sync with scroll */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: `${100 / zoom}vh`,
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <motion.div
            className="flex items-end justify-between"
            style={{ padding: `${56 / zoom}px ${32 / zoom}px ${16 / zoom}px` }}
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
            <LearnMoreButton href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="shrink-0">
              All on GitHub
            </LearnMoreButton>
          </motion.div>

          {/* Card arena — info panel on the left, the Comet card deck sweeping through the rest */}
          <div
            style={{ position: "relative", height: `calc(${100 / zoom}vh - ${156 / zoom}px)`, overflow: "hidden" }}
            onMouseMove={handleArenaMouseMove}
            onMouseLeave={() => setHoverPileZone(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: hoverPileZone ? 0.05 : 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: 480 / zoom,
                  zIndex: 5,
                  pointerEvents: hoverPileZone ? "none" : "auto",
                  background: "linear-gradient(to right, color-mix(in srgb, var(--bg) 96%, transparent) 0%, color-mix(in srgb, var(--bg) 90%, transparent) 38%, color-mix(in srgb, var(--bg) 50%, transparent) 68%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: `0 ${40 / zoom}px 0 ${40 / zoom}px`,
                }}
              >
                <div className="flex items-center gap-3 mb-2" style={{ marginBottom: `${8 / zoom}px` }}>
                  <div className="slabel" style={{ color: active.color }}>{active.sub}</div>
                  <span className="mono" style={{ fontSize: 11 / zoom, color: "var(--placeholder)" }}>
                    {String(activeIndex + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  </span>
                </div>
                <h2 style={{
                  fontSize: `calc(clamp(24px, 2.6vw, 38px) / ${zoom})`,
                  fontWeight: 900,
                  color: "var(--tx)",
                  margin: `0 0 ${12 / zoom}px`,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}>
                  {active.title}
                </h2>
                <div style={{
                  width: 40 / zoom, height: 2, borderRadius: 1,
                  background: `linear-gradient(90deg, ${active.color}, transparent)`,
                  marginBottom: 14 / zoom,
                  filter: `drop-shadow(0 0 6px ${active.color})`,
                }} />
                <p style={{ fontSize: 13 / zoom, color: "var(--text-soft)", lineHeight: 1.75, margin: 0 }}>
                  {active.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4" style={{ marginTop: `${16 / zoom}px`, gap: `${6 / zoom}px` }}>
                  {techs.map((s, idx) => {
                    const skill = s!;
                    const SkillIcon = skill.Icon;
                    return (
                      <span key={idx} className="ttag" style={{ fontSize: 11 / zoom }}>
                        {SkillIcon
                          ? <SkillIcon size={Math.max(8, 11 / zoom)} />
                          : <Image src={skill.src!} alt={skill.name} width={11 / zoom} height={11 / zoom} style={{ objectFit: "contain" }} />}
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
                <Link
                  href={`/projects/${active.slug}`}
                  className="mono inline-flex items-center gap-1.5 mt-6"
                  style={{ fontSize: 12 / zoom, color: active.color, fontWeight: 700, letterSpacing: "0.04em", width: "fit-content", marginTop: `${24 / zoom}px`, gap: `${6 / zoom}px` }}
                >
                  VIEW CASE STUDY
                  <FiArrowUpRight size={14 / zoom} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Comet project cards: a stack waits on the right, the active one
                sweeps to center on hover-tilt, then joins the pile on the left —
                all riding the same horizontal line as the info panel beside them. */}
            <ProjectCardDeck projects={projects} activeIndex={activeIndex} sweep={sweep} onSelectPast={focusAndGo} zoom={zoom} />
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 2, background: "var(--line)" }}
          >
            <motion.div
              style={{ height: "100%", width: progressW, background: "linear-gradient(90deg, var(--gtx-1), var(--gtx-2))" }}
            />
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-6 right-8 flex items-center gap-2 mono"
            style={{ opacity: hintOpacity, color: "var(--muted)", fontSize: 11 }}
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
          <LearnMoreButton href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="mt-4 sm:mt-0 self-start">
            GitHub
          </LearnMoreButton>
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
