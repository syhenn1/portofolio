"use client";

import { motion } from "framer-motion";
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
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const techIcons = [
  { Icon: SiReact,       color: "#61DAFB", label: "React",      size: 26 },
  { Icon: SiNextdotjs,   color: "#FFFFFF", label: "Next.js",    size: 24 },
  { Icon: SiTypescript,  color: "#3178C6", label: "TypeScript", size: 22 },
  { Icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind",   size: 24 },
  { Icon: SiPhp,         color: "#777BB4", label: "PHP",        size: 26 },
  { Icon: SiPython,      color: "#3776AB", label: "Python",     size: 24 },
  { Icon: SiLaravel,     color: "#FF2D20", label: "Laravel",    size: 22 },
  { Icon: SiFlutter,     color: "#40C4FF", label: "Flutter",    size: 24 },
  { Icon: SiFirebase,    color: "#FFCA28", label: "Firebase",   size: 22 },
  { Icon: SiMysql,       color: "#4479A1", label: "MySQL",      size: 26 },
  { Icon: SiFigma,       color: "#F24E1E", label: "Figma",      size: 22 },
  { Icon: SiGithub,      color: "#FFFFFF", label: "GitHub",     size: 24 },
  { Icon: SiJavascript,  color: "#F7DF1E", label: "JavaScript", size: 22 },
  { Icon: SiHtml5,       color: "#E34F26", label: "HTML5",      size: 24 },
  { Icon: SiDart,        color: "#0175C2", label: "Dart",       size: 22 },
  { Icon: SiSqlite,      color: "#003B57", label: "SQLite",     size: 22 },
];

const positions = [
  { top: "6%",  left: "7%"  },
  { top: "13%", left: "21%" },
  { top: "4%",  left: "40%" },
  { top: "8%",  left: "60%" },
  { top: "5%",  left: "77%" },
  { top: "14%", left: "89%" },
  { top: "36%", left: "2%"  },
  { top: "57%", left: "4%"  },
  { top: "38%", left: "92%" },
  { top: "58%", left: "91%" },
  { top: "78%", left: "7%"  },
  { top: "85%", left: "23%" },
  { top: "80%", left: "44%" },
  { top: "86%", left: "63%" },
  { top: "76%", left: "80%" },
  { top: "83%", left: "91%" },
];

const socialLinks = [
  { href: "https://github.com/syhenn1",            Icon: FiGithub,   label: "GitHub"   },
  { href: "https://linkedin.com/in/rifatsyahman/", Icon: FiLinkedin, label: "LinkedIn" },
  { href: "mailto:rifatsyahman@gmail.com",         Icon: FiMail,     label: "Email"    },
];

const techChips = ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Framer Motion"];

export default function Home() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#0f172a" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(16,185,129,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glow blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 700, height: 700, top: -260, right: -160,
          background: "radial-gradient(circle, rgba(16,185,129,.09), transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, 45, 0], y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 600, height: 600, bottom: -210, left: -160,
          background: "radial-gradient(circle, rgba(6,182,212,.07), transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, -35, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: 450, height: 450, top: "32%", left: "32%",
          background: "radial-gradient(circle, rgba(167,139,250,.04), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating tech icons — hidden on mobile */}
      {techIcons.map((tech, i) => {
        const pos = positions[i];
        const floatDur = 3.2 + (i % 4) * 0.9;
        const delay = i * 0.14;
        return (
          <motion.div
            key={tech.label}
            className="absolute z-10 hidden md:flex flex-col items-center gap-1.5"
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
            <span style={{ fontSize: "9px", fontWeight: 500, color: "#1e3a2f", fontFamily: "monospace", whiteSpace: "nowrap" }}>
              {tech.label}
            </span>
          </motion.div>
        );
      })}

      {/* Floating code card — top-right, desktop */}
      <motion.div
        className="absolute hidden lg:block z-10"
        style={{
          top: "18%", right: "5%",
          fontFamily: "monospace",
          fontSize: "12px", lineHeight: 1.95,
          background: "rgba(30,41,59,.78)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(16,185,129,.12)",
          padding: "18px 22px", borderRadius: "18px",
        }}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.7 },
          x: { delay: 1.2, duration: 0.7 },
          y: { delay: 2, duration: 5.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <span style={{ color: "#475569" }}>const</span>
        <span style={{ color: "#34d399" }}> portfolio</span>
        <span style={{ color: "#475569" }}> = {"{"}</span><br />
        &nbsp;&nbsp;<span style={{ color: "#fbbf24" }}>status</span>
        <span style={{ color: "#475569" }}>:</span>
        <span style={{ color: "#10b981" }}> &quot;building&quot;</span>
        <span style={{ color: "#475569" }}>,</span><br />
        &nbsp;&nbsp;<span style={{ color: "#fbbf24" }}>tech</span>
        <span style={{ color: "#475569" }}>:</span>
        <span style={{ color: "#06b6d4" }}> &quot;Next.js 16&quot;</span>
        <span style={{ color: "#475569" }}>,</span><br />
        &nbsp;&nbsp;<span style={{ color: "#fbbf24" }}>eta</span>
        <span style={{ color: "#475569" }}>:</span>
        <span style={{ color: "#a78bfa" }}> coming_soon</span><br />
        <span style={{ color: "#475569" }}>{"}"}</span>
      </motion.div>

      {/* Status badge — bottom-left, tablet+ */}
      <motion.div
        className="absolute hidden md:flex items-center gap-2 z-10"
        style={{
          bottom: "19%", left: "4%",
          background: "rgba(30,41,59,.78)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(74,222,128,.2)",
          padding: "10px 18px", borderRadius: "14px",
        }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.7 },
          x: { delay: 1.5, duration: 0.7 },
          y: { delay: 2.4, duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="relative w-2.5 h-2.5 shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full bg-green-400"
            animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <div className="relative w-full h-full rounded-full bg-green-400 z-10" />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 600, color: "#4ade80" }}>
          open_to_work = true
        </span>
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 text-center px-6 max-w-xl w-full">

        {/* Label line */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,.4))" }} />
          <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#10b981", fontWeight: 700, letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
            // portfolio.building
          </span>
          <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, rgba(16,185,129,.4))" }} />
        </motion.div>

        {/* Big title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontSize: "clamp(3.2rem, 12vw, 7rem)", fontWeight: 900, lineHeight: 1, color: "#f8fafc", marginBottom: "0.1em" }}
        >
          Portfolio
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          style={{
            fontSize: "clamp(3.2rem, 12vw, 7rem)", fontWeight: 900, lineHeight: 1,
            background: "linear-gradient(135deg, #34d399, #06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", marginBottom: "2rem",
          }}
        >
          On Progress
        </motion.div>

        {/* Animated progress bar */}
        <motion.div
          className="mb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569" }}>npm run build...</span>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#10b981" }}>in progress</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: "3px", background: "#1e293b" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #10b981, #06b6d4, #a78bfa)" }}
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "48%", "63%", "59%", "74%", "72%"] }}
              transition={{ duration: 5, delay: 1.1, ease: "easeOut", times: [0, 0.28, 0.5, 0.62, 0.85, 1] }}
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          style={{ fontSize: "14px", color: "#64748b", marginBottom: "1.5rem", lineHeight: 1.8 }}
        >
          Sedang dibangun ulang dengan teknologi modern.
          <br />
          Nantikan portfolio yang lebih{" "}
          <span style={{ color: "#10b981", fontWeight: 600 }}>keren</span>{" "}
          sebentar lagi.
        </motion.p>

        {/* Tech chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {techChips.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "monospace", fontSize: "11px", color: "#6ee7b7",
                background: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.18)",
                padding: "3px 12px", borderRadius: 999,
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex items-center justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
        >
          {socialLinks.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 18px", borderRadius: "10px",
                background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.14)",
                color: "#64748b", fontSize: "13px", fontWeight: 500, textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "#34d399";
                el.style.borderColor = "rgba(16,185,129,.45)";
                el.style.background = "rgba(16,185,129,.12)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "#64748b";
                el.style.borderColor = "rgba(16,185,129,.14)";
                el.style.background = "rgba(16,185,129,.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </motion.div>

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ marginTop: "2.5rem", fontFamily: "monospace", fontSize: "12px", color: "#1e293b" }}
        >
          &lt;rifat/&gt;
        </motion.p>
      </div>
    </div>
  );
}
