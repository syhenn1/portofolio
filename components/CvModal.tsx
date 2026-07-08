"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiX, FiExternalLink, FiFileText } from "react-icons/fi";
import { useIsClient } from "@/lib/useIsClient";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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

          {/* Modal */}
          <motion.div
            className="relative w-full flex flex-col overflow-hidden"
            style={{
              maxWidth: 900,
              maxHeight: "90vh",
              background: "var(--surf)",
              border: "1px solid rgba(255,106,0,0.25)",
              borderRadius: 4,
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3.5 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
            >
              <span className="mono text-sm font-semibold text-gray-700">
                CV Preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soc"
                  title="Open in new tab"
                >
                  <FiExternalLink size={14} />
                </a>
                <a
                  href={pdfUrl}
                  download
                  className="btn-em text-xs py-2 px-4"
                >
                  <FiDownload size={14} />
                  Download
                </a>
                <button
                  onClick={onClose}
                  className="soc"
                  aria-label="Close"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* PDF embed — desktop only, see isDesktop comment above */}
            {isDesktop ? (
              <div className="flex-1 min-h-0" style={{ background: "#e5e5e2" }}>
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0`}
                  title="CV Preview"
                  className="w-full h-full border-0"
                  style={{ minHeight: "70vh" }}
                />
              </div>
            ) : (
              <div
                className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 text-center px-8 py-16"
                style={{ background: "#e5e5e2" }}
              >
                <FiFileText size={48} style={{ color: "rgba(0,0,0,0.25)" }} />
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
