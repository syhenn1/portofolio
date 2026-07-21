"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiMenu, FiX, FiHome } from "react-icons/fi";
import { basePath } from "@/lib/basePath";
import { getLenisInstance } from "@/lib/lenis";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

// A compact corner widget instead of a full-width top bar — the old bar (plus
// its marching hazard stripe) sat flush against the very top edge of every
// page like a heavy "eyebrow" across the whole viewport, which read as
// visually disruptive. This keeps the same nav/Resume functionality behind a
// single top-right trigger that expands into a dropdown panel on demand.
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      if (y > lastY + 5 && y > 80) setHidden(true);
      else if (y < lastY - 5 || y <= 80) setHidden(false);
      lastY = y;

      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          setActive(link.href);
          break;
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click — this panel now doubles as the site's only nav,
  // so it needs to behave like a normal dropdown menu, not just a mobile fallback.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Scrolls to the top instead of a real navigation, so it's a smooth glide
  // rather than an abrupt native jump/reload.
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const lenis = getLenisInstance();
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      ref={rootRef}
      style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}
      animate={{ y: hidden && !open ? "-150%" : 0, opacity: hidden && !open ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        data-magnetic=""
        className="mono flex items-center gap-2"
        aria-label="Menu"
        aria-expanded={open}
        style={{
          padding: "9px 14px",
          borderRadius: 3,
          background: "color-mix(in srgb, var(--bg) 86%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--line)",
          boxShadow: "0 8px 24px var(--glass-shadow)",
          cursor: "pointer",
        }}
      >
        <span className="pg" style={{ width: 6, height: 6, borderRadius: 1, background: "var(--em)", display: "inline-block" }} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>
          <span style={{ color: "var(--placeholder)" }}>&lt;</span>
          <span style={{ color: "var(--tx)" }}>rifat</span>
          <span style={{ color: "var(--em)" }}>/&gt;</span>
        </span>
        {open ? <FiX size={16} style={{ color: "var(--tx)" }} /> : <FiMenu size={16} style={{ color: "var(--tx)" }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0"
            style={{
              top: "calc(100% + 8px)",
              width: 220,
              borderRadius: 3,
              background: "color-mix(in srgb, var(--bg) 96%, transparent)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--line)",
              boxShadow: "0 20px 45px var(--glass-shadow)",
              overflow: "hidden",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-1 p-2">
              <a
                href={`${basePath}/`}
                onClick={handleHomeClick}
                className="mono nav-link flex items-center gap-2 py-2.5 px-3 text-xs uppercase font-bold transition-all"
                style={{ letterSpacing: "0.08em" }}
              >
                <FiHome size={13} />
                Home
              </a>
              {navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <a
                    key={link.href}
                    href={`${basePath}/${link.href}`}
                    onClick={() => setOpen(false)}
                    className={`mono nav-link py-2.5 px-3 text-xs uppercase font-bold transition-all${isActive ? " active" : ""}`}
                    style={{ letterSpacing: "0.08em" }}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href={`${basePath}/assets/CV_Mochamad-Rifat-Syahman-Hambali.pdf`}
                download
                className="btn-em justify-center mt-1 py-2.5"
              >
                <FiDownload size={14} />
                Resume
              </a>

              <div className="pt-2 mt-1 flex justify-center" style={{ borderTop: "1px solid var(--line)" }}>
                <ThemeToggle className="mt-2" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
