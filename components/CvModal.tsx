"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiExternalLink, FiFileText } from "react-icons/fi";
import { useIsClient } from "@/lib/useIsClient";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Terminal } from "@/components/ui/terminal";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const BOOT_COMMANDS = ["cd ~/rifat-syahman", "cat cv.pdf | preview", "open --viewer"];
const BOOT_OUTPUTS: Record<number, string[]> = {
  0: ["✔ Found Rifat_Syahman_CV.pdf"],
  1: ["✔ Parsed 2 pages", "✔ Rendering complete"],
  2: ["✔ Viewer ready"],
};

// macOS-style window: traffic-light controls + a Terminal "boot sequence"
// (the ui/terminal.tsx primitive) that plays once on open before the real
// CV preview fades in underneath the same frame.
export default function CvModal({ isOpen, onClose, pdfUrl }: CvModalProps) {
  // About's own section is a positioned element with its own z-index, which
  // makes it a stacking context — any fixed-position child (this modal) gets
  // trapped inside it and compared at the SECTION's z-index everywhere else
  // on the page, no matter how high the modal's own z-index reads. Portaling
  // straight to <body> escapes that trap entirely.
  const mounted = useIsClient();
  // Embedding a PDF in an <iframe> is a known freeze/crash risk in mobile
  // Safari's WebKit PDF renderer — skip the embed there and hand off to the
  // browser's own PDF viewer instead, which is what mobile users expect anyway.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset the boot sequence each time the modal re-opens. Deferred via
      // rAF (rather than called directly in the effect body) so it's a
      // callback, not a synchronous setState during the effect itself.
      const frame = requestAnimationFrame(() => setBooted(false));
      document.body.style.overflow = "hidden";
      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const zoom = typeof window !== 'undefined' ? (parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1) : 1;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* macOS-style window */}
          <motion.div
            className="relative w-full flex flex-col overflow-hidden"
            style={{
              maxWidth: `${800 / zoom}px`,
              maxHeight: `${80 / zoom}vh`,
              background: "var(--glass-bg)",
              backdropFilter: "blur(24px) saturate(1.6)",
              WebkitBackdropFilter: "blur(24px) saturate(1.6)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              boxShadow: "0 30px 70px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.3)",
            }}
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Title bar — traffic lights, centered filename */}
            <div
              className="relative flex items-center justify-center px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid var(--line)", background: "var(--overlay)" }}
            >
              <div className="absolute left-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="group relative flex items-center justify-center rounded-full"
                  style={{ width: 12, height: 12, background: "#ff5f57" }}
                >
                  <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ fontSize: 8, lineHeight: 1, color: "#4d0000", fontWeight: 700 }}>×</span>
                </button>
                <span
                  className="group relative flex items-center justify-center rounded-full"
                  style={{ width: 12, height: 12, background: "#febc2e" }}
                >
                  <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ fontSize: 8, lineHeight: 1, color: "#7a5200", fontWeight: 700 }}>−</span>
                </span>
                <span
                  className="group relative flex items-center justify-center rounded-full"
                  style={{ width: 12, height: 12, background: "#28c840" }}
                >
                  <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ fontSize: 7, lineHeight: 1, color: "#0a3d0a", fontWeight: 700 }}>+</span>
                </span>
              </div>
              <span className="mono text-xs font-medium" style={{ color: "var(--muted)" }}>
                Rifat_Syahman_CV.pdf
              </span>
            </div>

            {/* Toolbar — open/download actions, Preview.app-style */}
            <div
              className="flex items-center justify-end gap-2 px-4 py-2 shrink-0"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="soc" title="Open in new tab">
                <FiExternalLink size={14} />
              </a>
              <a href={pdfUrl} download className="btn-em text-xs py-2 px-4">
                <FiDownload size={14} />
                Download
              </a>
            </div>

            {/* Body — boot sequence, then the CV preview. Explicit height (not
                flex-1) because both children inside are absolutely positioned
                for the crossfade, so they can't contribute intrinsic size. */}
            <div className="relative shrink-0" style={{ height: `${55 / zoom}vh`, background: "#0a0a0a" }}>
              <AnimatePresence mode="wait">
                {!booted ? (
                  <motion.div
                    key="boot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Terminal
                      commands={BOOT_COMMANDS}
                      outputs={BOOT_OUTPUTS}
                      typingSpeed={28}
                      delayBetweenCommands={350}
                      onComplete={() => setTimeout(() => setBooted(true), 350)}
                      className="h-full"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                    style={{ background: "var(--surf2)" }}
                  >
                    {isDesktop ? (
                      <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0`}
                        title="CV Preview"
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-8 py-16">
                        <FiFileText size={48} style={{ color: "color-mix(in srgb, var(--tx) 25%, transparent)" }} />
                        <p className="mono text-sm" style={{ color: "var(--muted)" }}>
                          Open the CV in your browser&apos;s own PDF viewer for the best experience on mobile.
                        </p>
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-em">
                          <FiExternalLink size={16} />
                          Open CV
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
