"use client";

import { memo, useCallback, useMemo, useRef, useState, Suspense, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import { basePath } from "@/lib/basePath";
import type { IconType } from "react-icons";
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiPhp, SiPython, SiDart,
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
const CSS_G = 6;                             // gap px (CSS)
const S     = 1 / 52;                        // CSS px → Three.js units
const cssKw = (u = 1) => Math.round(u * (CSS_B + CSS_G) - CSS_G);
const kw3   = (u = 1) => cssKw(u) * S;      // key cell width in 3D units

const KH3 = CSS_B * S;  // key cell depth in Z (≈ 0.885)
const GH3 = CSS_G * S;  // gap in X and Z (≈ 0.115)

// physical dimensions of each piece (in Three.js units)
const SWITCH_H    = 0.14;
const CAP_SKIRT_H = 0.08;  // bottom flange — wider, sits on switch
const CAP_BODY_H  = 0.22;  // main key surface — narrower, tapers inward
const CAP_H       = CAP_SKIRT_H + CAP_BODY_H;  // total keycap height (0.30)
const CAP_RAD     = 0.055;
const BASE_Y      = SWITCH_H + CAP_H / 2;  // keycap group resting Y

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
    { k: "8", w: 1 }, { k: "9", w: 1 }, { k: "0", w: 1 }, { k: "-", w: 1 }, { k: "=", w: 1 },
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
const BASE_SWITCH_COL = new THREE.Color("#0e0905");
const BASE_CAP_COL    = new THREE.Color("#1c1209");

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
    const target = hov && isTech ? BASE_Y - 0.08 : BASE_Y;
    capRef.current.position.y = THREE.MathUtils.lerp(
      capRef.current.position.y,
      target,
      0.22,
    );
  });

  // keycap material: base dark + subtle category tint for tech keys
  const capColor = useMemo(() => {
    if (!isTech || !def.c) return BASE_CAP_COL.clone();
    return BASE_CAP_COL.clone().lerp(new THREE.Color(def.c), 0.24);
  }, [isTech, def.c]);

  return (
    <group position={pos}>
      {/* ── Switch housing: narrower box, creates visible gap between keys ── */}
      <RoundedBox
        args={[w3 - 0.12, SWITCH_H, KH3 - 0.12]}
        radius={0.025}
        smoothness={2}
        position={[0, SWITCH_H / 2, 0]}
      >
        <meshStandardMaterial
          color={BASE_SWITCH_COL}
          roughness={0.88}
          metalness={0.02}
        />
      </RoundedBox>

      {/* ── Keycap: skirt + body compound shape (OEM-style profile) ── */}
      <group ref={capRef} position={[0, BASE_Y, 0]}>
        {/* Bottom flange — slightly wider, sits over the switch housing */}
        <RoundedBox
          args={[w3 - 0.08, CAP_SKIRT_H, KH3 - 0.08]}
          radius={0.04}
          smoothness={2}
          position={[0, -(CAP_H / 2 - CAP_SKIRT_H / 2), 0]}
        >
          <meshStandardMaterial color={capColor} roughness={0.80} metalness={0.03} />
        </RoundedBox>

        {/* Main key surface — narrower than skirt, tapers inward */}
        <RoundedBox
          args={[w3 - 0.13, CAP_BODY_H, KH3 - 0.13]}
          radius={CAP_RAD}
          smoothness={3}
          position={[0, CAP_SKIRT_H / 2, 0]}
        >
          <meshStandardMaterial
            color={capColor}
            emissive={isTech && def.c ? def.c : "#000000"}
            emissiveIntensity={hov && isTech ? 0.40 : isTech ? 0.028 : 0}
            roughness={0.65}
            metalness={0.04}
          />
        </RoundedBox>

        {/* ── Tech logo on keycap top face ── */}
        {isTech && (
          <Html
            position={[0, CAP_H / 2 + 0.01, 0]}
            center
            transform
            scale={0.022}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: hov ? def.c : "rgba(255,255,255,0.80)",
              filter: hov ? `drop-shadow(0 0 6px ${def.c})` : "none",
              transition: "color 0.15s, filter 0.15s",
              fontSize: 20,
              lineHeight: 1,
            }}>
              {def.I
                ? <def.I size={20} />
                : def.s
                  ? <img src={def.s} alt="" width={18} height={18} style={{ objectFit: "contain", display: "block" }} />
                  : null}
            </div>
          </Html>
        )}
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

    let zPos = totalDepth / 2 - KH3 / 2; // front row at +z

    ROWS.forEach((row) => {
      const rowWidth = row.reduce((s, k) => s + kw3(k.w ?? 1), 0) + (row.length - 1) * GH3;
      let cumX = -rowWidth / 2;

      row.forEach((key) => {
        const w = kw3(key.w ?? 1);
        positions.push({ def: key, pos: [cumX + w / 2, 0, zPos] });
        cumX += w + GH3;
      });

      zPos -= KH3 + GH3;
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

  const CHASSIS_H = 0.16;
  const PLATE_H   = 0.05;

  // Outer group is a static x-offset so the keyboard sits right of the info panel.
  // Inner groupRef is mutated by useFrame — keeping them separate avoids a
  // React re-render overwriting the y that useFrame wrote.
  return (
    <group position={[6, 0, 0]}>
    <group ref={groupRef}>
      {/* Keyboard body / case */}
      <RoundedBox
        args={[chassisW, CHASSIS_H, chassisD]}
        radius={0.14}
        smoothness={4}
        position={[0, -(CHASSIS_H / 2) - 0.01, 0]}
      >
        <meshStandardMaterial color="#0a0705" roughness={0.82} metalness={0.09} />
      </RoundedBox>

      {/* Mounting plate / PCB — visible in the gap between switch housings */}
      <RoundedBox
        args={[chassisW - 0.10, PLATE_H, chassisD - 0.10]}
        radius={0.12}
        smoothness={3}
        position={[0, PLATE_H / 2, 0]}
      >
        <meshStandardMaterial color="#0f0c07" roughness={0.92} metalness={0.02} />
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
    // Extends 120 px above/below so the tilted keyboard never clips at container edges
    <div
      className="absolute hidden lg:block"
      style={{
        top: "-120px", bottom: "-120px", left: 0, right: 0,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <Canvas
        camera={{ position: [-0.5, 5.5, 10.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent", width: "100%", height: "100%", pointerEvents: "auto" }}
        onCreated={({ camera }) => camera.lookAt(4, 0.6, -0.5)}
      >
        <ambientLight     intensity={0.40} color="#fff4e8" />
        <directionalLight intensity={0.90} color="#ffe8d0" position={[4, 10, 8]} />
        <pointLight       intensity={0.30} color="#ffd4a3" position={[-5, 6,  6]} />
        <pointLight       intensity={0.16} color="#cc8855" position={[ 4, 2,  8]} />

        <Suspense fallback={null}>
          <KeyboardScene onHover={handleKey} introRotY={introRotY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
