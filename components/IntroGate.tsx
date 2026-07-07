"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { basePath } from "@/lib/basePath";
import { useMediaQuery } from "@/lib/useMediaQuery";

const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

const SPECS = [
  { k: "STATUS", v: "ONLINE" },
  { k: "ROLE", v: "FULLSTACK DEV" },
  { k: "BASE", v: "JAKARTA, ID" },
  { k: "BUILD", v: "2026.07" },
];

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [booting, setBooting] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const html = document.documentElement;
    if (!entered) {
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [entered]);

  const handleStart = () => {
    if (booting) return;
    setBooting(true);
    setTimeout(() => setEntered(true), 620);
  };

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="intro-gate"
            className="fixed inset-0 z-[300] overflow-hidden"
            style={{ background: "#f7f7f4" }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Schematic grid texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 44px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 44px)",
              }}
            />
            {/* Faint radial fade so grid dims toward edges */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 0%, #f7f7f4 85%)" }}
            />

            {/* Hazard stripes — top & bottom edge */}
            <div className="hazard absolute top-0 left-0 right-0" />
            <div className="hazard absolute bottom-0 left-0 right-0" />

            {/* HUD corner brackets */}
            {(["tl", "tr", "bl", "br"] as const).map((pos) => {
              const size = 22;
              const base: React.CSSProperties = {
                position: "absolute", width: size, height: size,
                borderColor: "rgba(255,106,0,0.6)", margin: 20,
              };
              const styleMap: Record<string, React.CSSProperties> = {
                tl: { ...base, top: 0, left: 0, borderTop: "2px solid", borderLeft: "2px solid" },
                tr: { ...base, top: 0, right: 0, borderTop: "2px solid", borderRight: "2px solid" },
                bl: { ...base, bottom: 0, left: 0, borderBottom: "2px solid", borderLeft: "2px solid" },
                br: { ...base, bottom: 0, right: 0, borderBottom: "2px solid", borderRight: "2px solid" },
              };
              return <div key={pos} style={styleMap[pos]} />;
            })}

            {/* Faint RS watermark, right side */}
            <div
              className="absolute pointer-events-none select-none hidden md:block"
              style={{
                right: "6%", top: "50%", transform: "translateY(-50%)",
                fontSize: "34vw", fontWeight: 900,
                color: "rgba(0,0,0,0.035)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.06em", lineHeight: 1,
              }}
            >
              RS
            </div>

            {/* Slow breathing glow behind the watermark — background animation */}
            <motion.div
              className="absolute pointer-events-none hidden md:block"
              style={{
                right: "10%", top: "50%", translateX: "0%", translateY: "-50%",
                width: 560, height: 560, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,106,0,.14) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Lanyard — dangles over the RS watermark. Full-bleed like HeroLanyard
                (same aspect ratio the camera/anchor numbers were tuned against) so
                the card settles at the same relative spot instead of drifting
                off-frame in a narrower container. Unmounted the instant booting
                starts (well before Hero's own Lanyard mounts at `entered`) so the
                two WebGL contexts never briefly coexist — running both at once
                (on top of the always-on WaveBackground + keyboard canvases) can
                blow past the browser's live-context budget and lose a context,
                which freezes that canvas's render loop and silently kills drag. */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
              {isDesktop && !booting && (
                <Lanyard
                  frontImage={`${basePath}/images/ripat.png`}
                  imageFit="cover"
                  position={[0, 1.0, 20]}
                  fov={13}
                  lanyardWidth={0.9}
                />
              )}
            </div>

            {/* Content — anchored bottom-left, asymmetric. pointer-events-none so it
                doesn't block the draggable lanyard canvas behind it; re-enabled
                just on the button below. */}
            <div className="relative z-10 h-full w-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 pointer-events-none">
              <motion.div
                className="mono flex items-center gap-2 mb-6"
                style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", letterSpacing: "0.15em" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span style={{ width: 6, height: 6, background: "var(--em)", display: "inline-block" }} />
                SYSTEM // PORTFOLIO_OS
              </motion.div>

              <motion.h1
                className="font-black leading-[0.95] uppercase"
                style={{ fontSize: "clamp(2.6rem, 9vw, 6rem)", letterSpacing: "-0.01em" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Rifat
                <br />
                Syahman
              </motion.h1>

              <motion.div
                style={{ width: 64, height: 3, background: "var(--em)", margin: "18px 0" }}
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />

              <motion.p
                className="mono uppercase text-gray-600 mb-9"
                style={{ fontSize: 12, letterSpacing: "0.12em" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Fullstack Developer — Software Engineer
              </motion.p>

              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <motion.button
                  onClick={handleStart}
                  disabled={booting}
                  className="btn-em group"
                  whileHover={!booting ? { scale: 1.045 } : undefined}
                  whileTap={!booting ? { scale: 0.96 } : undefined}
                  animate={booting ? { scale: 0.96, opacity: 0.75 } : { scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  START
                  <motion.span
                    className="inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                    animate={booting ? { x: [0, 5, 0] } : { x: 0 }}
                    transition={booting ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                  >
                    <FiArrowRight size={16} />
                  </motion.span>
                </motion.button>
                <div className="mono mt-3" style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}>
                  {booting ? "LAUNCHING…" : "PRESS TO CONTINUE"}
                </div>
              </motion.div>
            </div>

            {/* Spec plate — desktop only, right column */}
            <motion.div
              className="hidden lg:flex flex-col absolute right-20 bottom-20 mono pointer-events-none"
              style={{ fontSize: 11, letterSpacing: "0.08em" }}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {SPECS.map((s, i) => (
                <div
                  key={s.k}
                  className="flex items-center gap-8 justify-between"
                  style={{
                    padding: "9px 0",
                    borderTop: i === 0 ? "1px solid rgba(0,0,0,0.1)" : "none",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    width: 220,
                  }}
                >
                  <span style={{ color: "rgba(0,0,0,0.4)" }}>{s.k}</span>
                  <span style={{ color: s.k === "STATUS" ? "var(--em)" : "#1a1a1a" }}>{s.v}</span>
                </div>
              ))}
            </motion.div>

            {/* Boot sequence — plays once on START before the gate itself exits:
                a quick orange bloom + a scan-line sweep, echoing the HUD/terminal
                theme so leaving feels like a deliberate "system launch" beat
                instead of an instant cut to the site. */}
            <AnimatePresence>
              {booting && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(circle at 50% 55%, rgba(255,106,0,0.4) 0%, transparent 65%)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute left-0 right-0"
                    style={{
                      height: 2,
                      background: "linear-gradient(90deg, transparent, var(--em), transparent)",
                      boxShadow: "0 0 24px 4px rgba(255,106,0,0.55)",
                    }}
                    initial={{ top: "-2%" }}
                    animate={{ top: "102%" }}
                    transition={{ duration: 0.6, ease: "easeIn" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
