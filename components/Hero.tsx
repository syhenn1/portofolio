"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MobileHeroCard from "@/components/MobileHeroCard";
import { MorphingHeroText } from "@/components/MorphingHeroText";
import VariableFontText from "@/components/VariableFontText";
import Waves from "@/components/Waves";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPhp,
  SiPython,
  SiLaravel,
  SiFlutter,
  SiFirebase,
  SiMysql,
  SiFigma,
  SiGithub,
  SiJavascript,
  SiHtml5,
  SiDart,
  SiSqlite,
} from "react-icons/si";
import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi";
import TiltButton from "@/components/TiltButton";
import LearnMoreButton from "@/components/LearnMoreButton";
import Typewriter from "@/components/Typewriter";
import { socialLinks } from "@/lib/data";

const techIcons = [
  { Icon: SiReact, color: "#61DAFB", label: "React", size: 26 },
  { Icon: SiNextdotjs, color: "#FFFFFF", label: "Next.js", size: 24 },
  { Icon: SiTypescript, color: "#3178C6", label: "TypeScript", size: 22 },
  { Icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind", size: 24 },
  { Icon: SiPhp, color: "#777BB4", label: "PHP", size: 26 },
  { Icon: SiPython, color: "#3776AB", label: "Python", size: 24 },
  { Icon: SiLaravel, color: "#FF2D20", label: "Laravel", size: 22 },
  { Icon: SiFlutter, color: "#40C4FF", label: "Flutter", size: 24 },
  { Icon: SiFirebase, color: "#FFCA28", label: "Firebase", size: 22 },
  { Icon: SiMysql, color: "#4479A1", label: "MySQL", size: 26 },
  { Icon: SiFigma, color: "#F24E1E", label: "Figma", size: 22 },
  { Icon: SiGithub, color: "#FFFFFF", label: "GitHub", size: 24 },
  { Icon: SiJavascript, color: "#F7DF1E", label: "JavaScript", size: 22 },
  { Icon: SiHtml5, color: "#E34F26", label: "HTML5", size: 24 },
  { Icon: SiDart, color: "#0175C2", label: "Dart", size: 22 },
  { Icon: SiSqlite, color: "#003B57", label: "SQLite", size: 22 },
];

const positions = [
  { top: "6%", left: "7%" },
  { top: "13%", left: "21%" },
  { top: "4%", left: "40%" },
  { top: "8%", left: "60%" },
  { top: "5%", left: "77%" },
  { top: "14%", left: "89%" },
  { top: "36%", left: "2%" },
  { top: "57%", left: "4%" },
  { top: "38%", left: "92%" },
  { top: "58%", left: "91%" },
  { top: "78%", left: "7%" },
  { top: "85%", left: "23%" },
  { top: "80%", left: "44%" },
  { top: "86%", left: "63%" },
  { top: "76%", left: "80%" },
  { top: "83%", left: "91%" },
];

const heroSocials = [
  { href: socialLinks.github, Icon: FiGithub, label: "GitHub" },
  { href: socialLinks.linkedin, Icon: FiLinkedin, label: "LinkedIn" },
  { href: `mailto:${socialLinks.email}`, Icon: FiMail, label: "Email" },
];

const MARQUEE_TEXT = "FULLSTACK DEVELOPER · PROJECT MANAGER · FULLSTACK DEVELOPER · PROJECT MANAGER · FULLSTACK DEVELOPER · PROJECT MANAGER · FULLSTACK DEVELOPER · PROJECT MANAGER · FULLSTACK DEVELOPER · PROJECT MANAGER ·";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const textX1 = useTransform(scrollY, [0, 600], [0, -800]);
  const textX2 = useTransform(scrollY, [0, 600], [-200, 600]);
  const textX3 = useTransform(scrollY, [0, 600], [100, -700]);
  const darkenOpacity = useTransform(scrollY, [0, 700], [0, 0.72]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-end lg:items-start overflow-hidden pt-24 lg:pt-[10vh]"
      style={{ background: "linear-gradient(160deg, var(--bg) 0%, var(--surf) 50%, var(--bg) 100%)" }}
    >
      <Waves className="absolute inset-0 z-0 pointer-events-none" pointerSize={0} />

      {/* Lighting: main orange spotlight top-right */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 900, height: 900, top: -300, right: -150,
          background: "radial-gradient(circle, color-mix(in srgb, var(--em) 16%, transparent) 0%, color-mix(in srgb, var(--em) 6%, transparent) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Lighting: white rim light left */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 600, height: 600, bottom: -100, left: -80,
          background: "radial-gradient(circle, rgba(255,255,255,.06) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Lighting: neutral fill — center */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 500, height: 500, top: "35%", left: "20%",
          background: "radial-gradient(circle, rgba(255,255,255,.03) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Scroll-reactive fade overlay — hero blends into the page background as it scrolls away */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 15, background: "var(--bg)", opacity: darkenOpacity }}
      />

      {/* Animated glow blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 550, height: 550, top: -180, right: 100,
          background: "radial-gradient(circle, color-mix(in srgb, var(--em) 9%, transparent), transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 28, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Premium RS watermark, right side (placeholder replacing the lanyard after start) */}
      <div
        className="absolute pointer-events-none select-none hidden lg:block z-0"
        style={{
          right: "10%",
          top: "46%",
          transform: "translateY(-50%)",
          fontSize: "25vw",
          fontWeight: 900,
          color: "color-mix(in srgb, var(--tx) 1.8%, transparent)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "-0.06em",
          lineHeight: 1,
        }}
      >
        RS
      </div>
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 380, height: 380, bottom: 0, left: 0,
          background: "radial-gradient(circle, rgba(255,255,255,.05), transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, -22, 0], y: [0, -22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating tech icons */}
      {techIcons.map((tech, i) => {
        const pos = positions[i];
        const floatDur = 3.2 + (i % 4) * 0.9;
        const delay = i * 0.14;
        return (
          <motion.div
            key={tech.label}
            className="absolute z-10 hidden md:flex flex-col items-center gap-1.5 pointer-events-none"
            style={{ top: pos.top, left: pos.left }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0.12, 0.42, 0.12], scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: floatDur, repeat: Infinity, delay, ease: "easeInOut" },
              scale: { duration: 0.55, delay: delay * 0.5 },
              y: { duration: floatDur * 1.25, repeat: Infinity, delay, ease: "easeInOut" },
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--overlay)",
                border: "1px solid var(--line)",
                backdropFilter: "blur(6px)",
              }}
            >
              <tech.Icon size={tech.size} color={tech.color} />
            </div>
          </motion.div>
        );
      })}

      {/* Lanyard placeholder — actual canvas rendered outside hero to avoid overflow clip */}

      {/* Status floating badge */}
      <motion.div
        className="absolute z-10 hidden md:flex items-center gap-2 glass rounded-sm px-4 py-2.5"
        style={{ left: "8%", bottom: "13%", borderColor: "color-mix(in srgb, var(--em) 30%, transparent)", clipPath: "var(--cut)" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, -7, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.5 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5, repeatDelay: 1.2 },
        }}
      >
        <div className="relative w-2.5 h-2.5 shrink-0">
          <div className="absolute inset-0 rounded-full pg" style={{ background: "var(--em)" }} />
          <div className="relative w-full h-full rounded-full z-10" style={{ background: "var(--em)" }} />
        </div>
        <span className="mono text-xs font-semibold" style={{ color: "var(--em)" }}>open_to_work = true</span>
      </motion.div>

      {/* Text content — pointer-events-none so it doesn't block the draggable
          lanyard canvas behind it; re-enabled on the actual interactive rows */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-5 pb-24 sm:pb-28 lg:pb-0 lg:px-8 pointer-events-none">
        <motion.div
          className="mono text-xs mb-5 pointer-events-auto"
          style={{ color: "var(--muted)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ color: "var(--muted)" }}>const</span>{" "}
          <VariableFontText
            containerRef={heroRef}
            className="mono"
            style={{ color: "var(--em2)" }}
            fontVariationMapping={{
              y: { name: "wght", min: 400, max: 800 },
              x: { name: "wght", min: 400, max: 800 },
            }}
          >
            developer
          </VariableFontText>
          <span style={{ color: "var(--muted)" }}> = {"{"}</span>
        </motion.div>

        <motion.h1
          className="font-black leading-none mb-3 pointer-events-auto"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <MorphingHeroText text={"Rifat\nSyahman"} hoverText={"Software\nDeveloper"} />
        </motion.h1>

        <motion.div
          className="flex items-center gap-2 mb-4 mono text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <span style={{ color: "var(--muted)" }}>role:</span>
          <Typewriter />
        </motion.div>

        <motion.p
          className="text-gray-600 mb-8 leading-relaxed max-w-sm text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          D4 Informatics Engineering student at PNJ. I love building things
          that are <span style={{ color: "var(--em)" }} className="font-semibold">useful</span> —
          from web and mobile to data analysis.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mb-7 pointer-events-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <TiltButton href="#projects" className="btn-em" magnetic>
            View Projects
            <FiArrowRight size={16} />
          </TiltButton>
          <LearnMoreButton href="#contact">Get In Touch</LearnMoreButton>
        </motion.div>

        <motion.div
          className="flex gap-2.5 pointer-events-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {heroSocials.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="soc"
              aria-label={label}
              data-magnetic=""
            >
              <Icon size={16} />
            </a>
          ))}
        </motion.div>

        <motion.div
          className="mono text-xs mt-5"
          style={{ color: "var(--muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          {"}"}
        </motion.div>

        <MobileHeroCard />
      </div>

      {/* Scroll-reactive marquee — 3 rows */}
      <div className="absolute left-0 right-0 z-2 pointer-events-none select-none overflow-hidden" style={{ bottom: 80 }}>
        <motion.div style={{ x: textX1 }} className="whitespace-nowrap leading-none">
          <span
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px color-mix(in srgb, var(--em) 35%, transparent)",
              letterSpacing: "0.06em",
              display: "block",
            }}
          >
            {MARQUEE_TEXT}
          </span>
        </motion.div>
        <motion.div style={{ x: textX2 }} className="whitespace-nowrap leading-none">
          <span
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px color-mix(in srgb, var(--em) 25%, transparent)",
              letterSpacing: "0.06em",
              display: "block",
            }}
          >
            {MARQUEE_TEXT}
          </span>
        </motion.div>
        <motion.div style={{ x: textX3 }} className="whitespace-nowrap leading-none">
          <span
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px color-mix(in srgb, var(--em) 15%, transparent)",
              letterSpacing: "0.06em",
              display: "block",
            }}
          >
            {MARQUEE_TEXT}
          </span>
        </motion.div>
      </div>

      {/* Bottom edge fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 200, zIndex: 25, background: "linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 85%, transparent) 30%, transparent 100%)" }}
      />

      {/* Scroll / Swipe hint */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 swipe-hint"
        style={{ color: "var(--muted)" }}
      >
        <span className="mono text-xs tracking-widest hidden sm:block" style={{ fontSize: "10px" }}>
          SCROLL
        </span>
        <span className="mono text-xs tracking-widest sm:hidden" style={{ fontSize: "10px" }}>
          SWIPE
        </span>
        <div className="w-4 h-6 rounded-full border border-current flex items-start justify-center pt-1">
          <motion.div
            className="w-0.5 h-1.5 bg-current rounded-full"
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </a>
    </section>
  );
}
