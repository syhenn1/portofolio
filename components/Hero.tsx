"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiMail as FiMailOutline } from "react-icons/fi";
import TiltButton from "@/components/TiltButton";
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

const MARQUEE_TEXT = "FULLSTACK DEVELOPER · PROJECT MANAGER · FULLSTACK DEVELOPER · PROJECT MANAGER ·";

export default function Hero() {
  const { scrollY } = useScroll();
  const textX1 = useTransform(scrollY, [0, 600], [0, -320]);
  const textX2 = useTransform(scrollY, [0, 600], [-120, 240]);

  return (
    <section
      id="hero"
      className="relative z-0 min-h-screen flex items-end overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d0705 0%, #150905 50%, #1c0800 100%)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(204,0,0,.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Lighting: main red spotlight top-right */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 900, height: 900, top: -300, right: -150,
          background: "radial-gradient(circle, rgba(204,0,0,.18) 0%, rgba(255,70,30,.08) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Lighting: orange rim light left */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 600, height: 600, bottom: -100, left: -80,
          background: "radial-gradient(circle, rgba(255,107,53,.1) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Lighting: warm yellow fill — center */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 500, height: 500, top: "35%", left: "20%",
          background: "radial-gradient(circle, rgba(247,201,72,.04) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Animated glow blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 550, height: 550, top: -180, right: 100,
          background: "radial-gradient(circle, rgba(204,0,0,.1), transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 28, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 380, height: 380, bottom: 0, left: 0,
          background: "radial-gradient(circle, rgba(255,107,53,.07), transparent 70%)",
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
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
        className="absolute z-10 hidden md:flex items-center gap-2 glass rounded-2xl px-4 py-2.5"
        style={{ left: "8%", bottom: "13%", borderColor: "rgba(255,107,53,.25)" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, -7, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.5 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5, repeatDelay: 1.2 },
        }}
      >
        <div className="relative w-2.5 h-2.5 shrink-0">
          <div className="absolute inset-0 rounded-full bg-orange-400 pg" />
          <div className="relative w-full h-full rounded-full bg-orange-400 z-10" />
        </div>
        <span className="mono text-xs font-semibold text-orange-400">open_to_work = true</span>
      </motion.div>

      {/* Text content */}
      <div className="relative z-30 px-3 sm:px-5 pb-24 sm:pb-28 lg:pb-[9%] lg:pl-[7%] max-w-xl w-full">
        <motion.div
          className="mono text-xs mb-5"
          style={{ color: "var(--muted)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ color: "#5c3a2a" }}>const</span>
          <span style={{ color: "var(--em2)" }}> developer</span>
          <span style={{ color: "#5c3a2a" }}> = {"{"}</span>
        </motion.div>

        <motion.h1
          className="font-black leading-[1.0] mb-3 text-white"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Rifat
          <br />
          <span className="gtx">Syahman</span>
        </motion.h1>

        <motion.div
          className="flex items-center gap-2 mb-4 mono text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <span style={{ color: "#7a5a43" }}>role:</span>
          <Typewriter />
        </motion.div>

        <motion.p
          className="text-gray-400 mb-8 leading-relaxed max-w-sm text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Mahasiswa D4 Teknik Informatika di PNJ. Suka membangun hal-hal
          yang <span style={{ color: "var(--em)" }} className="font-semibold">bermanfaat</span> —
          dari web, mobile, sampai analisis data.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mb-7"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <TiltButton href="#projects" className="btn-em">
            View Projects
            <FiArrowRight size={16} />
          </TiltButton>
          <TiltButton href="#contact" className="btn-ghost">
            <FiMailOutline size={16} />
            Get In Touch
          </TiltButton>
        </motion.div>

        <motion.div
          className="flex gap-2.5"
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
            >
              <Icon size={16} />
            </a>
          ))}
        </motion.div>

        <motion.div
          className="mono text-xs mt-5"
          style={{ color: "#5c3a2a" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          {"}"}
        </motion.div>
      </div>

      {/* Scroll-reactive marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-2 pointer-events-none select-none overflow-hidden">
        <motion.div style={{ x: textX1 }} className="whitespace-nowrap leading-none">
          <span
            style={{
              fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(204, 0, 0, 0.35)",
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
              fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(204, 0, 0, 0.22)",
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
        style={{ height: 200, zIndex: 25, background: "linear-gradient(to top, var(--bg) 0%, rgba(14,9,5,.8) 30%, transparent 100%)" }}
      />

      {/* Scroll hint */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        style={{ color: "#4a2a1a" }}
      >
        <span className="mono text-xs tracking-widest" style={{ fontSize: "10px" }}>
          SCROLL
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
