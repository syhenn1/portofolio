"use client";

import { memo, useCallback, useMemo, useRef, useState, Suspense, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
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
  name:  string;
  cat:   string;
  c:     string;
  desc:  string;
  I?:    IconType;
  s?:    string;
};

// ─── internal key definition ──────────────────────────────────────────────────
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

// ─── layout constants ─────────────────────────────────────────────────────────
const CSS_B = 46;                            // 1u key px (CSS)
const CSS_G = 3;                             // gap px (CSS) — tight realistic spacing
const S     = 1 / 52;                        // CSS px → Three.js units
const cssKw = (u = 1) => Math.round(u * (CSS_B + CSS_G) - CSS_G);
const kw3   = (u = 1) => cssKw(u) * S;      // key cell width in 3D units

const KH3 = CSS_B * S;  // key cell depth in Z (≈ 0.885)
const GH3 = CSS_G * S;  // gap in X and Z (≈ 0.058)

// physical dimensions of each piece (in Three.js units)
const SWITCH_H    = 0.28;  // tall switch stem — gives mechanical depth look
const CAP_SKIRT_H = 0.08;  // bottom flange — wider, sits on switch
const CAP_BODY_H  = 0.24;  // main key surface — narrower, tapers inward
const CAP_H       = CAP_SKIRT_H + CAP_BODY_H;  // total keycap height (0.32)
const CAP_RAD     = 0.06;
const BASE_Y      = SWITCH_H + CAP_H / 2;  // keycap group resting Y (0.44)

// ─── category accent colours ──────────────────────────────────────────────────
const PL = "#10b981";
const FW = "#06b6d4";
const DB = "#f59e0b";
const TL = "#a78bfa";
const ID = "#f97316";

// ─── key layout (same 33 tech tools as before) ────────────────────────────────
const ROWS: K[][] = [
  [
    { k: "ESC", w: 1.25 },
    { k: "F1",  s: `${basePath}/images/icons8-visual-studio-480.png`,            c: ID, name: "Visual Studio", cat: "IDE",  desc: "Full-featured IDE by Microsoft" },
    { k: "F2",  s: `${basePath}/images/icons8-visual-studio-code-2019-480.png`, c: ID, name: "VS Code",       cat: "IDE",  desc: "Lightweight, extensible code editor" },
    { k: "F3",  w: 1 }, { k: "F4",  w: 1 }, { k: "F5",  w: 1 }, { k: "F6",  w: 1 },
    { k: "F7",  w: 1 }, { k: "F8",  w: 1 }, { k: "F9",  w: 1 }, { k: "F10", w: 1 }, { k: "F11", w: 1 }, { k: "F12", w: 1 },
    { k: "DEL", w: 1.25 },
  ],
  [
    { k: "`",  w: 1 },
    { k: "1", I: SiHtml5,      c: PL, name: "HTML5",      cat: "Language", desc: "Markup structure for the web" },
    { k: "2", I: SiCss,        c: PL, name: "CSS3",        cat: "Language", desc: "Styling and layout for web" },
    { k: "3", I: SiJavascript, c: PL, name: "JavaScript", cat: "Language", desc: "Dynamic scripting for the browser" },
    { k: "4", I: SiTypescript, c: PL, name: "TypeScript", cat: "Language", desc: "JavaScript with static types" },
    { k: "5", I: SiPhp,        c: PL, name: "PHP",         cat: "Language", desc: "Server-side scripting language" },
    { k: "6", I: SiPython,     c: PL, name: "Python",      cat: "Language", desc: "Versatile scripting & data" },
    { k: "7", I: SiDart,       c: PL, name: "Dart",         cat: "Language", desc: "Language powering Flutter apps" },
    { k: "8", I: SiOpenjdk,    c: PL, name: "Java",         cat: "Language", desc: "Object-oriented, cross-platform language" },
    { k: "9", I: SiDotnet,     c: PL, name: "VB.NET",       cat: "Language", desc: ".NET language for Windows applications" },
    { k: "0", w: 1 }, { k: "-", w: 1 }, { k: "=", w: 1 },
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
    { k: "[", w: 1 }, { k: "]", w: 1 },
    { k: "\\", w: 1.5 },
  ],
  [
    { k: "CAPS", w: 1.75 },
    { k: "A", I: SiMysql,      c: DB, name: "MySQL",      cat: "Database", desc: "Popular open-source relational DB" },
    { k: "S", I: SiPostgresql, c: DB, name: "PostgreSQL", cat: "Database", desc: "Advanced open-source SQL database" },
    { k: "D", I: SiMongodb,    c: DB, name: "MongoDB",    cat: "Database", desc: "NoSQL document database" },
    { k: "F", I: SiSqlite,     c: DB, name: "SQLite",     cat: "Database", desc: "Lightweight embedded database" },
    { k: "G", s: `${basePath}/images/Oracle-Symbol.png`, c: DB, name: "Oracle", cat: "Database", desc: "Enterprise relational database" },
    { k: "H", w: 1 }, { k: "J", w: 1 }, { k: "K", w: 1 }, { k: "L", w: 1 }, { k: ";", w: 1 }, { k: "'", w: 1 },
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
    { k: "/", w: 1 },
    { k: "⇧", w: 2.75 },
  ],
  [
    { k: "ctrl", w: 1.5  },
    { k: "⊞",   w: 1.25 },
    { k: "alt",  w: 1.25 },
    { k: "",     w: 7    },  // spacebar
    { k: "alt",  w: 1.25 },
    { k: "fn",   w: 1.25 },
    { k: "ctrl", w: 1.5  },
  ],
];

// ─── colour helpers ───────────────────────────────────────────────────────────
const BASE_SWITCH_COL = new THREE.Color("#d8d8d3");
const BASE_CAP_COL    = new THREE.Color("#fbfbf9");

// ─── Key3D ────────────────────────────────────────────────────────────────────
type Key3DProps = {
  def:     K;
  pos:     [number, number, number];
  onHover: (k: K | null) => void;
};

const Key3D = memo(function Key3D({ def, pos, onHover }: Key3DProps) {
  const [hov, setHov] = useState(false);
  const capRef = useRef<THREE.Group>(null);
  const isTech = !!def.name;
  const w3 = kw3(def.w ?? 1);

  // smooth keypress animation every frame
  useFrame(() => {
    if (!capRef.current) return;
    const target = hov && isTech ? BASE_Y - 0.14 : BASE_Y;
    capRef.current.position.y = THREE.MathUtils.lerp(
      capRef.current.position.y,
      target,
      0.22,
    );
  });

  // keycap material: base dark + subtle category tint for tech keys
  const capColor = useMemo(() => {
    if (!isTech || !def.c) return BASE_CAP_COL.clone();
    return BASE_CAP_COL.clone().lerp(new THREE.Color(def.c), 0.42);
  }, [isTech, def.c]);

  return (
    <group position={pos}>
      {/* ── Switch housing: close-fit column, case walls show in the gap ── */}
      <RoundedBox
        args={[w3 - 0.06, SWITCH_H, KH3 - 0.06]}
        radius={0.02}
        smoothness={2}
        position={[0, SWITCH_H / 2, 0]}
      >
        <meshStandardMaterial
          color={BASE_SWITCH_COL}
          roughness={0.70}
          metalness={0.06}
        />
      </RoundedBox>

      {/* ── Keycap: skirt + body compound shape (OEM-style profile) ── */}
      <group ref={capRef} position={[0, BASE_Y, 0]}>
        {/* Bottom flange — slightly wider, sits over the switch housing */}
        <RoundedBox
          args={[w3 - 0.04, CAP_SKIRT_H, KH3 - 0.04]}
          radius={0.035}
          smoothness={2}
          position={[0, -(CAP_H / 2 - CAP_SKIRT_H / 2), 0]}
        >
          <meshStandardMaterial color={capColor} roughness={0.66} metalness={0.06} />
        </RoundedBox>

        {/* Main key surface — narrower than skirt, tapers inward */}
        <RoundedBox
          args={[w3 - 0.08, CAP_BODY_H, KH3 - 0.08]}
          radius={CAP_RAD}
          smoothness={3}
          position={[0, CAP_SKIRT_H / 2, 0]}
        >
          <meshStandardMaterial
            color={capColor}
            emissive={isTech && def.c ? def.c : "#000000"}
            emissiveIntensity={hov && isTech ? 0.50 : isTech ? 0.07 : 0}
            roughness={0.48}
            metalness={0.10}
          />
        </RoundedBox>

        {/* ── Key legend: tech logo for tech keys, printed label for every other key ── */}
        {isTech ? (
          <Html
            position={[0, CAP_H / 2 + 0.04, 0]}
            center
            zIndexRange={[100, 0]}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: hov ? def.c : "#2a2a26",
              filter: hov
                ? `drop-shadow(0 0 6px ${def.c}) brightness(1.15)`
                : "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
              transition: "color 0.15s, filter 0.15s",
              fontSize: 18,
              lineHeight: 1,
              width: 18,
              height: 18,
            }}>
              {def.I
                ? <def.I size={18} />
                : def.s
                  ? <img src={def.s} alt="" width={16} height={16} style={{ objectFit: "contain", display: "block" }} />
                  : null}
            </div>
          </Html>
        ) : def.k ? (
          <Html
            position={[0, CAP_H / 2 + 0.04, 0]}
            center
            zIndexRange={[100, 0]}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <span
              className="mono"
              style={{
                color: "#3a3a35",
                fontSize: def.k.length > 2 ? 9 : 12,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))",
              }}
            >
              {def.k}
            </span>
          </Html>
        ) : null}
      </group>

      {/* ── Invisible hit volume — full cell size for easy targeting ── */}
      <mesh
        visible={false}
        position={[0, (SWITCH_H + CAP_H) / 2 + 0.01, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHov(true);
          if (isTech) onHover(def);
        }}
        onPointerLeave={() => {
          setHov(false);
          onHover(null);
        }}
      >
        <boxGeometry args={[w3 + 0.01, SWITCH_H + CAP_H + 0.10, KH3 + 0.01]} />
      </mesh>
    </group>
  );
});

// ─── KeyboardScene (the 3D group + chassis + all keys) ────────────────────────
function KeyboardScene({ onHover, introRotY }: { onHover: (k: K | null) => void; introRotY?: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-compute every key's 3D center position (static, no deps)
  const { keyPositions, chassisW, chassisD } = useMemo(() => {
    const totalDepth = ROWS.length * KH3 + (ROWS.length - 1) * GH3;
    const positions: { def: K; pos: [number, number, number] }[] = [];

    // rotation.x = 0.90 maps +Z to bottom, -Z to top in camera view.
    // Start ESC row at -Z (top) and increment toward +Z so spacebar is at bottom.
    let zPos = -(totalDepth / 2 - KH3 / 2);

    ROWS.forEach((row) => {
      const rowWidth = row.reduce((s, k) => s + kw3(k.w ?? 1), 0) + (row.length - 1) * GH3;
      let cumX = -rowWidth / 2;

      row.forEach((key) => {
        const w = kw3(key.w ?? 1);
        positions.push({ def: key, pos: [cumX + w / 2, 0, zPos] });
        cumX += w + GH3;
      });

      zPos += KH3 + GH3;
    });

    // chassis is 1u wider & deeper than the reference row (numbers row)
    const refW = ROWS[1].reduce((s, k) => s + kw3(k.w ?? 1), 0) + (ROWS[1].length - 1) * GH3;
    const pad  = 18 * S; // chassis padding in 3D units
    return {
      keyPositions: positions,
      chassisW:     refW + pad * 2,
      chassisD:     totalDepth + pad * 2 + 0.3, // extra depth at bottom of keyboard
    };
  }, []);

  // Mouse-reactive tilt + scroll-driven spin + idle float
  useFrame(({ pointer, clock }) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const spinY = introRotY?.current ?? 0;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.90 + pointer.y * -0.12, 0.06);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.16 + spinY, 0.06);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -0.13, 0.06);
    g.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.20;
  });

  const CHASSIS_H = 0.52;  // tall case body — gives keyboard proper thickness
  const PLATE_H   = 0.08;
  // Case top surface sits at Y=0.10 (wraps 36% of switch height),
  // making keys look recessed/deep like real mechanical switches.
  const CASE_TOP  = 0.10;

  return (
    <group position={[3.0, 0, 0]}>
    <group ref={groupRef}>
      {/* Keyboard body / case — top surface at CASE_TOP, extends deep below */}
      <RoundedBox
        args={[chassisW, CHASSIS_H, chassisD]}
        radius={0.14}
        smoothness={4}
        position={[0, CASE_TOP - CHASSIS_H / 2, 0]}
      >
        <meshStandardMaterial color="#f2f2ee" roughness={0.55} metalness={0.08} />
      </RoundedBox>

      {/* Mounting plate / PCB — sits inside the chassis */}
      <RoundedBox
        args={[chassisW - 0.10, PLATE_H, chassisD - 0.10]}
        radius={0.12}
        smoothness={3}
        position={[0, PLATE_H / 2, 0]}
      >
        <meshStandardMaterial color="#dcdcd7" roughness={0.7} metalness={0.05} />
      </RoundedBox>

      {/* All keys */}
      {keyPositions.map(({ def, pos }, i) => (
        <Key3D key={i} def={def} pos={pos} onHover={onHover} />
      ))}
    </group>
    </group>
  );
}

// ─── MechanicalKeyboard3D (default export, dynamic-imported by Skills.tsx) ───
interface Props {
  onHover?: (tech: TechKey | null) => void;
  introRotY?: RefObject<number>;
}

export default function MechanicalKeyboard3D({ onHover, introRotY }: Props) {
  const handleKey = useCallback(
    (k: K | null) => {
      if (k?.name) {
        onHover?.({
          label: k.k,
          name:  k.name!,
          cat:   k.cat!,
          c:     k.c!,
          desc:  k.desc!,
          I:     k.I,
          s:     k.s,
        });
      } else {
        onHover?.(null);
      }
    },
    [onHover],
  );

  return (
    <div
      className="absolute hidden lg:block"
      style={{
        top: "-220px", bottom: "-380px", left: "38%", right: 0,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <Canvas
        camera={{ position: [0, 7, 13], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent", width: "100%", height: "100%", pointerEvents: "auto" }}
        onCreated={({ camera }) => camera.lookAt(0, 0.3, -0.5)}
      >
        <ambientLight     intensity={0.90} color="#fff4e8" />
        <directionalLight intensity={1.80} color="#ffe8d0" position={[4, 10, 8]} />
        <pointLight       intensity={0.70} color="#ffd4a3" position={[-5, 6,  6]} />
        <pointLight       intensity={0.40} color="#cc8855" position={[ 4, 2,  8]} />

        <Suspense fallback={null}>
          <KeyboardScene onHover={handleKey} introRotY={introRotY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
