"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiX, FiExternalLink } from "react-icons/fi";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export default function CvModal({ isOpen, onClose, pdfUrl }: CvModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
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
              border: "1px solid rgba(204,0,0,0.2)",
              borderRadius: 20,
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
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="mono text-sm font-semibold text-gray-300">
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

            {/* PDF embed */}
            <div className="flex-1 min-h-0" style={{ background: "#1a1a1a" }}>
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                title="CV Preview"
                className="w-full h-full border-0"
                style={{ minHeight: "70vh" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
