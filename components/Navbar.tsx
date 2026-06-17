"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiMenu, FiX } from "react-icons/fi";
import { basePath } from "@/lib/basePath";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

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

  return (
    <motion.div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}
      className="px-3 sm:px-5 pt-3 sm:pt-4"
      animate={{ y: hidden ? "-110%" : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <nav className="glass max-w-5xl mx-auto rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-7 py-3.5 flex justify-between items-center">
          <a href={`${basePath}/`} className="flex items-center gap-1 mono text-sm font-bold">
            <span style={{ color: "#475569" }}>&lt;</span>
            <span className="text-white">rifat</span>
            <span style={{ color: "var(--em)" }}>/&gt;</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={`${basePath}/${link.href}`}
                className={`nav-link ${active === link.href ? "active" : ""}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={`${basePath}/assets/CV_Mochamad-Rifat-Syahman-Hambali.pdf`}
              download
              className="btn-em py-2 px-4 text-xs"
            >
              <FiDownload size={14} />
              Resume
            </a>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-white"
            aria-label="Menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="md:hidden border-t border-white/5 overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={`${basePath}/${link.href}`}
                    onClick={() => setOpen(false)}
                    className="py-2.5 px-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-all"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={`${basePath}/assets/CV_Mochamad-Rifat-Syahman-Hambali.pdf`}
                  download
                  className="btn-em justify-center mt-2 py-3"
                >
                  <FiDownload size={14} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
}
