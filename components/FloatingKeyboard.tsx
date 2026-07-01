"use client";

import { memo, useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { basePath } from "@/lib/basePath";
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiPhp, SiPython, SiDart,
  SiReact, SiNextdotjs, SiExpress, SiLaravel, SiCodeigniter, SiFlutter,
  SiTailwindcss, SiBootstrap, SiNodedotjs, SiFirebase,
  SiMysql, SiPostgresql, SiMongodb, SiSqlite,
  SiFigma, SiGithub, SiGit, SiDocker, SiNotion, SiJira,
} from "react-icons/si";
import type { IconType } from "react-icons";

// ─── sizing ───────────────────────────────────────────────────────────────────
// Larger pitch + taller RISE = mechanical keyboard look
const B    = 46;  // 1u key size (px)
const G    = 6;   // gap between keys (px)
const RISE = 20;  // keycap translateZ — real MX caps sit ~10mm above the plate

const kw = (u = 1) => Math.round(u * (B + G) - G);

// ─── exported type (used by Skills.tsx) ──────────────────────────────────────
export type TechKey = {
  label: string;
  name:  string;
  cat:   string;
  c:     string;
  desc:  string;
  I?:    IconType;
  s?:    string;
};

type K = {
  k:     string;
  I?:    IconType;
  s?:    string;
  c?:    string;
  w?:    number;
  name?: string;
  cat?:  string;
  desc?: string;
};

// ─── category accent colours ──────────────────────────────────────────────────
const PL = "#10b981";
const FW = "#06b6d4";
const DB = "#f59e0b";
const TL = "#a78bfa";
const ID = "#f97316";

// ─── key layout ───────────────────────────────────────────────────────────────
const ROWS: K[][] = [
  [
    { k: "ESC", w: 1.25 },
    { k: "F1", s: `${basePath}/images/icons8-visual-studio-480.png`,            c: ID, name: "Visual Studio", cat: "IDE",  desc: "Full-featured IDE by Microsoft" },
    { k: "F2", s: `${basePath}/images/icons8-visual-studio-code-2019-480.png`, c: ID, name: "VS Code",       cat: "IDE",  desc: "Lightweight, extensible code editor" },
    { k: "F3" }, { k: "F4" }, { k: "F5" }, { k: "F6" },
    { k: "F7" }, { k: "F8" }, { k: "F9" }, { k: "F10" }, { k: "F11" }, { k: "F12" },
    { k: "DEL", w: 1.25 },
  ],
  [
    { k: "`" },
    { k: "1", I: SiHtml5,      c: PL, name: "HTML5",      cat: "Language", desc: "Markup structure for the web" },
    { k: "2", I: SiCss,        c: PL, name: "CSS3",        cat: "Language", desc: "Styling and layout for web" },
    { k: "3", I: SiJavascript, c: PL, name: "JavaScript", cat: "Language", desc: "Dynamic scripting for the browser" },
    { k: "4", I: SiTypescript, c: PL, name: "TypeScript", cat: "Language", desc: "JavaScript with static types" },
    { k: "5", I: SiPhp,        c: PL, name: "PHP",         cat: "Language", desc: "Server-side scripting language" },
    { k: "6", I: SiPython,     c: PL, name: "Python",      cat: "Language", desc: "Versatile scripting & data" },
    { k: "7", I: SiDart,       c: PL, name: "Dart",         cat: "Language", desc: "Language powering Flutter apps" },
    { k: "8" }, { k: "9" }, { k: "0" }, { k: "-" }, { k: "=" },
    { k: "⌫", w: 2 },
  ],
  [
    { k: "TAB", w: 1.5 },
    { k: "Q", I: SiReact,       c: FW, name: "React",       cat: "Framework", desc: "UI component library for web" },
    { k: "W", I: SiNextdotjs,   c: FW, name: "Next.js",     cat: "Framework", desc: "Full-stack React framework" },
    { k: "E", I: SiExpress,     c: FW, name: "Express.js",  cat: "Framework", desc: "Minimal Node.js web framework" },
    { k: "R", I: SiLaravel,     c: FW, name: "Laravel",     cat: "Framework", desc: "PHP web application framework" },
    { k: "T", I: SiCodeigniter, c: FW, name: "CodeIgniter", cat: "Framework", desc: "Lightweight PHP framework" },
    { k: "Y", I: SiFlutter,     c: FW, name: "Flutter",     cat: "Framework", desc: "Cross-platform mobile SDK" },
    { k: "U", I: SiTailwindcss, c: FW, name: "Tailwind",    cat: "Framework", desc: "Utility-first CSS framework" },
    { k: "I", I: SiBootstrap,   c: FW, name: "Bootstrap",   cat: "Framework", desc: "Responsive CSS component library" },
    { k: "O", I: SiNodedotjs,   c: FW, name: "Node.js",     cat: "Framework", desc: "JavaScript backend runtime" },
    { k: "P", I: SiFirebase,    c: FW, name: "Firebase",    cat: "Framework", desc: "Google's app development platform" },
    { k: "[" }, { k: "]" },
    { k: "\\", w: 1.5 },
  ],
  [
    { k: "CAPS", w: 1.75 },
    { k: "A", I: SiMysql,      c: DB, name: "MySQL",      cat: "Database", desc: "Popular open-source relational DB" },
    { k: "S", I: SiPostgresql, c: DB, name: "PostgreSQL", cat: "Database", desc: "Advanced open-source SQL database" },
    { k: "D", I: SiMongodb,    c: DB, name: "MongoDB",    cat: "Database", desc: "NoSQL document database" },
    { k: "F", I: SiSqlite,     c: DB, name: "SQLite",     cat: "Database", desc: "Lightweight embedded database" },
    { k: "G", s: `${basePath}/images/Oracle-Symbol.png`, c: DB, name: "Oracle", cat: "Database", desc: "Enterprise relational database" },
    { k: "H" }, { k: "J" }, { k: "K" }, { k: "L" }, { k: ";" }, { k: "'" },
    { k: "↵", w: 2.25 },
  ],
  [
    { k: "⇧", w: 2.25 },
    { k: "Z", I: SiFigma,  c: TL, name: "Figma",       cat: "Tool", desc: "Collaborative UI/UX design tool" },
    { k: "X", I: SiGithub, c: TL, name: "GitHub",      cat: "Tool", desc: "Code hosting & collaboration" },
    { k: "C", I: SiGit,    c: TL, name: "Git",          cat: "Tool", desc: "Distributed version control" },
    { k: "V", I: SiDocker, c: TL, name: "Docker",       cat: "Tool", desc: "Container platform for apps" },
    { k: "B", I: SiNotion, c: TL, name: "Notion",       cat: "Tool", desc: "All-in-one workspace & notes" },
    { k: "N", I: SiJira,   c: TL, name: "Jira",          cat: "Tool", desc: "Project tracking & issue management" },
    { k: "M", s: `${basePath}/images/icons8-excel-480.png`,     c: TL, name: "Excel",      cat: "Tool", desc: "Microsoft spreadsheet application" },
    { k: ",", s: `${basePath}/images/icons8-word-480.png`,       c: TL, name: "Word",        cat: "Tool", desc: "Microsoft word processor" },
    { k: ".", s: `${basePath}/images/icons8-powerpoint-480.png`, c: TL, name: "PowerPoint", cat: "Tool", desc: "Microsoft presentation tool" },
    { k: "/" },
    { k: "⇧", w: 2.75 },
  ],
  [
    { k: "ctrl", w: 1.5 },
    { k: "⊞",   w: 1.25 },
    { k: "alt",  w: 1.25 },
    { k: "",     w: 7 },
    { k: "alt",  w: 1.25 },
    { k: "fn",   w: 1.25 },
    { k: "ctrl", w: 1.5 },
  ],
];

// ─── Key ──────────────────────────────────────────────────────────────────────
const Key = memo(function Key({
  def,
  onHover,
}: {
  def: K;
  onHover: (k: K | null) => void;
}) {
  const [hov, setHov] = useState(false);
  const isTech = !!def.name;
  const hi     = !!def.c;
  const w      = kw(def.w);
  const Icon   = def.I;

  // box-shadow offset of RISE-2 simulates the keycap front wall
  // visible at the bottom of each raised cap when viewed at 52 ° tilt
  const shadowRest = hi
    ? `0 ${RISE - 2}px 0 0 #080503, inset 0 1px 0 rgba(255,255,255,0.18), 0 0 26px ${def.c}30`
    : `0 ${RISE - 4}px 0 0 #060402, inset 0 1px 0 rgba(255,255,255,0.05)`;

  const shadowPress = hi
    ? `0 3px 0 0 #080503, inset 0 3px 12px rgba(0,0,0,0.68), 0 0 14px ${def.c}20`
    : `0 2px 0 0 #060402, inset 0 2px 8px rgba(0,0,0,0.54)`;

  return (
    <div
      style={{
        width: w,
        height: B,
        flexShrink: 0,
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      {/* ── Switch housing / plate cutout at Z = 0 ───────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          background: hi
            ? "linear-gradient(180deg, #1a0e06 0%, #0e0803 100%)"
            : "#0f0a07",
          border: "1px solid rgba(0,0,0,0.95)",
          borderTop: hi ? `1px solid ${def.c}28` : "1px solid rgba(255,255,255,0.015)",
        }}
      />

      {/* ── Keycap face — raised by RISE, concave radial gradient ────── */}
      <motion.div
        style={{
          position: "absolute",
          top: 1, left: 1, right: 1, bottom: 1,
          borderRadius: 7,
          // radial-gradient creates the subtle concave dish look
          background: hi
            ? `radial-gradient(ellipse at 50% 20%, #3e2814 0%, #1e1007 72%)`
            : `radial-gradient(ellipse at 50% 20%, #2d2215 0%, #171209 72%)`,
          border: hi
            ? "1px solid rgba(255,255,255,0.09)"
            : "1px solid rgba(255,255,255,0.02)",
          borderTop: hi ? `2px solid ${def.c}82` : "1px solid rgba(255,255,255,0.04)",
          boxShadow: hov && isTech ? shadowPress : shadowRest,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isTech ? "pointer" : "default",
          overflow: "visible",
          transformStyle: "preserve-3d",
        }}
        // z (translateZ) animates in the rotated 3D space — looks like a
        // physical keypress pushing the cap into the switch
        animate={{ z: hov && isTech ? RISE - 10 : RISE }}
        transition={{ type: "spring", stiffness: 720, damping: 28, mass: 0.38 }}
        onHoverStart={() => { if (isTech) { setHov(true); onHover(def); } }}
        onHoverEnd={() => { setHov(false); onHover(null); }}
      >
        {/* RGB underglow spills below pressed key */}
        {hi && hov && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: 12,
              background: `radial-gradient(ellipse at 50% 118%, ${def.c}60 0%, transparent 74%)`,
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
        )}

        {Icon && <Icon size={16} />}

        {!Icon && def.s && def.k && (
          <Image
            src={def.s}
            alt={def.k}
            width={15}
            height={15}
            style={{ objectFit: "contain", opacity: 0.85 }}
          />
        )}

        {!Icon && !def.s && def.k && (
          <span
            style={{
              fontSize: def.k.length > 3 ? 6 : def.k.length > 2 ? 7 : 9,
              color: "rgba(255,255,255,0.13)",
              fontFamily: "monospace",
              fontWeight: 700,
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {def.k}
          </span>
        )}
      </motion.div>
    </div>
  );
});

// ─── FloatingKeyboard ─────────────────────────────────────────────────────────
interface Props {
  onHover?: (tech: TechKey | null) => void;
}

export default function FloatingKeyboard({ onHover }: Props) {
  const [kbActive, setKbActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── mouse-tracking motion values ──────────────────────────────────────────
  // rawX / rawY: normalized position inside the keyboard container (-0.5 → 0.5)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // rotateY: left ↔ right tilt  (cursor left → left side tilts toward viewer)
  const rotateYSpring = useSpring(
    useTransform(rawX, [-0.5, 0.5], [15, -15]),
    { stiffness: 180, damping: 28, restDelta: 0.001 },
  );

  // rotateX: base 52° top-down view ± vertical tilt from cursor
  const rotateXSpring = useSpring(
    useTransform(rawY, [-0.5, 0.5], [44, 62]),
    { stiffness: 180, damping: 28, restDelta: 0.001 },
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width  - 0.5);
      rawY.set((e.clientY - r.top)  / r.height - 0.5);
    },
    [rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);   // spring back to base tilt
    rawY.set(0);
    setKbActive(false);
  }, [rawX, rawY]);

  const handleKey = useCallback(
    (k: K | null) => {
      if (k?.name) {
        onHover?.({ label: k.k, name: k.name!, cat: k.cat!, c: k.c!, desc: k.desc!, I: k.I, s: k.s });
      } else {
        onHover?.(null);
      }
    },
    [onHover],
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none hidden lg:block"
      style={{ zIndex: 0 }}
    >
      {/* ── perspective context + mouse tracking container ───────────── */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          right: "0%",
          top: "50%",
          transform: "translateY(-48%)",
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          pointerEvents: "auto",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setKbActive(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Layer 1: scroll-triggered spin-in ───────────────────────
            Keyboard starts edge-on (rotateY -90°) and deep in Z space,
            springs forward and rotates to face on scroll-into-view.  */}
        <motion.div
          initial={{ rotateY: -90, z: -280, opacity: 0 }}
          whileInView={{ rotateY: 0, z: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            rotateY: { type: "spring", stiffness: 50, damping: 14, delay: 0.05 },
            z:       { type: "spring", stiffness: 50, damping: 14, delay: 0.05 },
            opacity: { duration: 0.55, delay: 0.05 },
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ── Layer 2: cursor-reactive tilt + idle float ───────────
              rotateX / rotateY are Framer Motion springs driven by
              mouse position — gives the "tilting toward your cursor"
              parallax feel.  rotateZ stays constant for the diagonal.
              y float starts after the spin-in finishes (delay 1.7s). */}
          <motion.div
            style={{
              rotateX: rotateXSpring,   // spring-smoothed, 44°–62° range
              rotateY: rotateYSpring,   // spring-smoothed, ±15° range
              rotateZ: -7,              // constant diagonal
              transformStyle: "preserve-3d",
            }}
            animate={{
              y:       kbActive ? -14 : [0, -18, 0],
              opacity: kbActive ? 0.97 : 0.90,
            }}
            transition={
              kbActive
                ? { duration: 0.38, ease: "easeOut" }
                : {
                    y:       { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
                    opacity: { duration: 0.3 },
                  }
            }
          >
            {/* ── Mechanical keyboard chassis / case ──────────────── */}
            <div
              style={{
                padding: "16px 16px 24px",
                borderRadius: 18,
                // case body: dark anodized aluminium feel
                background:
                  "linear-gradient(170deg, #1f1509 0%, #0e0904 50%, #0a0602 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                // stacked shadows simulate the physical case thickness
                // visible as a dark ledge at the near edge when tilted
                boxShadow: [
                  "0 0 0 1px rgba(255,255,255,0.04)",
                  "0 0 0 3px rgba(0,0,0,0.92)",
                  "0 6px 0 3px #090602",
                  "0 10px 0 5px #080501",
                  "0 14px 0 7px #070400",
                  "inset 0 1px 0 rgba(255,255,255,0.09)",
                  "inset 0 -2px 0 rgba(0,0,0,0.5)",
                  "0 90px 200px rgba(0,0,0,0.88)",
                ].join(", "),
                display: "flex",
                flexDirection: "column",
                gap: G,
                transformStyle: "preserve-3d",
              }}
            >
              {ROWS.map((row, ri) => (
                <div
                  key={ri}
                  style={{ display: "flex", gap: G, transformStyle: "preserve-3d" }}
                >
                  {row.map((key, ki) => (
                    <Key key={`${ri}-${ki}`} def={key} onHover={handleKey} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
