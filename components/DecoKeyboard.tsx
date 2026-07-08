"use client";

import Image from "next/image";
import styles from "./DecoKeyboard.module.css";
import { basePath } from "@/lib/basePath";
import type { IconType } from "react-icons";
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiPhp, SiPython, SiDart,
  SiOpenjdk, SiDotnet,
  SiReact, SiNextdotjs, SiExpress, SiLaravel, SiCodeigniter, SiFlutter,
  SiTailwindcss, SiBootstrap, SiNodedotjs, SiFirebase,
  SiMysql, SiPostgresql, SiMongodb, SiSqlite,
  SiFigma, SiGithub, SiGit, SiDocker, SiNotion, SiJira,
} from "react-icons/si";

// ─── exported type (consumed by Skills.tsx) ───────────────────────────────────
export type TechKey = {
  label: string;
  name: string;
  cat: string;
  c: string;
  desc: string;
  I?: IconType;
  s?: string;
};

type K = {
  k: string;
  small?: boolean;
  grow?: number;
  tech?: Omit<TechKey, "label">;
};

const PL = "var(--kb-lang)"; // Language
const FW = "var(--kb-framework)"; // Framework
const DB = "var(--kb-database)"; // Database
const TL = "var(--kb-tool)"; // Tool
const ID = "var(--kb-ide)"; // IDE

const FN_KEYS: K[] = [
  { k: "esc", small: true },
  { k: "f1", small: true, tech: { name: "Visual Studio", cat: "IDE", c: ID, desc: "Full-featured IDE by Microsoft", s: `${basePath}/images/icons8-visual-studio-480.png` } },
  { k: "f2", small: true, tech: { name: "VS Code", cat: "IDE", c: ID, desc: "Lightweight, extensible code editor", s: `${basePath}/images/icons8-visual-studio-code-2019-480.png` } },
  { k: "f3", small: true }, { k: "f4", small: true }, { k: "f5", small: true }, { k: "f6", small: true },
  { k: "f7", small: true }, { k: "f8", small: true }, { k: "f9", small: true }, { k: "f10", small: true }, { k: "f11", small: true }, { k: "f12", small: true },
];
const FN_GROUP: K[] = [{ k: "prt sc", small: true }, { k: "scr lk", small: true }, { k: "pause", small: true }];

const ROW1: K[] = [
  { k: "`" },
  { k: "1", tech: { name: "HTML5", cat: "Language", c: PL, desc: "Markup structure for the web", I: SiHtml5 } },
  { k: "2", tech: { name: "CSS3", cat: "Language", c: PL, desc: "Styling and layout for web", I: SiCss } },
  { k: "3", tech: { name: "JavaScript", cat: "Language", c: PL, desc: "Dynamic scripting for the browser", I: SiJavascript } },
  { k: "4", tech: { name: "TypeScript", cat: "Language", c: PL, desc: "JavaScript with static types", I: SiTypescript } },
  { k: "5", tech: { name: "PHP", cat: "Language", c: PL, desc: "Server-side scripting language", I: SiPhp } },
  { k: "6", tech: { name: "Python", cat: "Language", c: PL, desc: "Versatile scripting & data", I: SiPython } },
  { k: "7", tech: { name: "Dart", cat: "Language", c: PL, desc: "Language powering Flutter apps", I: SiDart } },
  { k: "8", tech: { name: "Java", cat: "Language", c: PL, desc: "Object-oriented, cross-platform language", I: SiOpenjdk } },
  { k: "9", tech: { name: "VB.NET", cat: "Language", c: PL, desc: ".NET language for Windows applications", I: SiDotnet } },
  { k: "0" }, { k: "-" }, { k: "=" },
  { k: "back", grow: 2 },
];

const ROW2: K[] = [
  { k: "tab", grow: 1.5 },
  { k: "q", tech: { name: "React", cat: "Framework", c: FW, desc: "UI component library for web", I: SiReact } },
  { k: "w", tech: { name: "Next.js", cat: "Framework", c: FW, desc: "Full-stack React framework", I: SiNextdotjs } },
  { k: "e", tech: { name: "Express.js", cat: "Framework", c: FW, desc: "Minimal Node.js web framework", I: SiExpress } },
  { k: "r", tech: { name: "Laravel", cat: "Framework", c: FW, desc: "PHP web application framework", I: SiLaravel } },
  { k: "t", tech: { name: "CodeIgniter", cat: "Framework", c: FW, desc: "Lightweight PHP framework", I: SiCodeigniter } },
  { k: "y", tech: { name: "Flutter", cat: "Framework", c: FW, desc: "Cross-platform mobile SDK", I: SiFlutter } },
  { k: "u", tech: { name: "Tailwind", cat: "Framework", c: FW, desc: "Utility-first CSS framework", I: SiTailwindcss } },
  { k: "i", tech: { name: "Bootstrap", cat: "Framework", c: FW, desc: "Responsive CSS component library", I: SiBootstrap } },
  { k: "o", tech: { name: "Node.js", cat: "Framework", c: FW, desc: "JavaScript backend runtime", I: SiNodedotjs } },
  { k: "p", tech: { name: "Firebase", cat: "Framework", c: FW, desc: "Google's app development platform", I: SiFirebase } },
  { k: "[" }, { k: "]" },
  { k: "\\", grow: 1.5 },
];

const ROW3: K[] = [
  { k: "caps", grow: 1.75 },
  { k: "a", tech: { name: "MySQL", cat: "Database", c: DB, desc: "Popular open-source relational DB", I: SiMysql } },
  { k: "s", tech: { name: "PostgreSQL", cat: "Database", c: DB, desc: "Advanced open-source SQL database", I: SiPostgresql } },
  { k: "d", tech: { name: "MongoDB", cat: "Database", c: DB, desc: "NoSQL document database", I: SiMongodb } },
  { k: "f", tech: { name: "SQLite", cat: "Database", c: DB, desc: "Lightweight embedded database", I: SiSqlite } },
  { k: "g", tech: { name: "Oracle", cat: "Database", c: DB, desc: "Enterprise relational database", s: `${basePath}/images/Oracle-Symbol.png` } },
  { k: "h" }, { k: "j" }, { k: "k" }, { k: "l" }, { k: ";" }, { k: "'" },
  { k: "enter", grow: 2.25 },
];

const ROW4: K[] = [
  { k: "shift", grow: 2.25 },
  { k: "z", tech: { name: "Figma", cat: "Tool", c: TL, desc: "Collaborative UI/UX design tool", I: SiFigma } },
  { k: "x", tech: { name: "GitHub", cat: "Tool", c: TL, desc: "Code hosting & collaboration", I: SiGithub } },
  { k: "c", tech: { name: "Git", cat: "Tool", c: TL, desc: "Distributed version control", I: SiGit } },
  { k: "v", tech: { name: "Docker", cat: "Tool", c: TL, desc: "Container platform for apps", I: SiDocker } },
  { k: "b", tech: { name: "Notion", cat: "Tool", c: TL, desc: "All-in-one workspace & notes", I: SiNotion } },
  { k: "n", tech: { name: "Jira", cat: "Tool", c: TL, desc: "Project tracking & issue management", I: SiJira } },
  { k: "m", tech: { name: "Excel", cat: "Tool", c: TL, desc: "Microsoft spreadsheet application", s: `${basePath}/images/icons8-excel-480.png` } },
  { k: ",", tech: { name: "Word", cat: "Tool", c: TL, desc: "Microsoft word processor", s: `${basePath}/images/icons8-word-480.png` } },
  { k: ".", tech: { name: "PowerPoint", cat: "Tool", c: TL, desc: "Microsoft presentation tool", s: `${basePath}/images/icons8-powerpoint-480.png` } },
  { k: "/" },
  { k: "shift", grow: 2.75 },
];

const NAV_TOP: K[] = [{ k: "ins", small: true }, { k: "home", small: true }, { k: "pg up", small: true }];
const NAV_BOTTOM: K[] = [{ k: "del", small: true }, { k: "end", small: true }, { k: "pg dn", small: true }];

interface KeyProps {
  def: K;
  onHover: (tech: TechKey | null) => void;
}

function Key({ def, onHover }: KeyProps) {
  const tech = def.tech;
  return (
    <p
      className={def.small ? `${styles.key} ${styles.keySmall}` : styles.key}
      style={{
        flexGrow: def.grow,
        ...(tech ? { ["--tech-color" as string]: tech.c } : undefined),
      }}
      data-tech={tech ? "" : undefined}
      onMouseEnter={tech ? () => onHover({ label: def.k, ...tech }) : undefined}
      onMouseLeave={tech ? () => onHover(null) : undefined}
    >
      {tech ? (
        tech.I ? (
          <tech.I size={16} className={styles.techIcon} />
        ) : tech.s ? (
          <Image src={tech.s} alt={tech.name} width={14} height={14} className={styles.techIcon} style={{ objectFit: "contain" }} />
        ) : null
      ) : (
        def.k
      )}
    </p>
  );
}

/**
 * Decorative 3D color-cycling keyboard for the Skills section — keys for real
 * tools show that tool's icon and, on hover, report it via onHover so Skills.tsx
 * can show a hero-style info panel next to the keyboard (same idea as the old
 * MechanicalKeyboard3D, just CSS/DOM instead of WebGL).
 */
export default function DecoKeyboard({ onHover }: { onHover?: (tech: TechKey | null) => void }) {
  const handleHover = onHover ?? (() => {});

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.keyboard}>
          <div className={styles.left}>
            <div className={styles.top}>
              <div className={styles.fnKeys}>
                {FN_KEYS.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
              <div className={styles.group}>
                {FN_GROUP.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
            </div>

            <div className={styles.main}>
              <div className={styles.row}>
                {ROW1.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
              <div className={styles.row}>
                {ROW2.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
              <div className={styles.row}>
                {ROW3.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
              <div className={styles.row}>
                {ROW4.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
              <div className={styles.row}>
                <Key def={{ k: "ctrl", grow: 1.5 }} onHover={handleHover} />
                <Key def={{ k: "win", grow: 1.25 }} onHover={handleHover} />
                <Key def={{ k: "alt", grow: 1.25 }} onHover={handleHover} />
                <Key def={{ k: "", grow: 7 }} onHover={handleHover} />
                <Key def={{ k: "alt", grow: 1.25 }} onHover={handleHover} />
                <Key def={{ k: "fn", grow: 1.25 }} onHover={handleHover} />
                <Key def={{ k: "ctrl", grow: 1.5 }} onHover={handleHover} />
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.top}>
              <div className={styles.row}>
                {NAV_TOP.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
              <div className={styles.row}>
                {NAV_BOTTOM.map((def, i) => (
                  <Key key={i} def={def} onHover={handleHover} />
                ))}
              </div>
            </div>

            <div className={styles.arrows}>
              <div className={styles.row}>
                <div className={styles.key} style={{ visibility: "hidden" }} />
                <Key def={{ k: "▲", small: true }} onHover={handleHover} />
                <div className={styles.key} style={{ visibility: "hidden" }} />
              </div>
              <div className={styles.row}>
                <Key def={{ k: "◀", small: true }} onHover={handleHover} />
                <Key def={{ k: "▼", small: true }} onHover={handleHover} />
                <Key def={{ k: "▶", small: true }} onHover={handleHover} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
