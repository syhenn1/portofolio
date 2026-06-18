"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageLightbox({ images, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          onClick={onClose}
        />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 soc"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 z-10 soc"
              aria-label="Previous"
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 z-10 soc"
              aria-label="Next"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}

        <motion.div
          key={index}
          className="relative z-10 max-w-[90vw] max-h-[85vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={images[index]}
            alt={`Screenshot ${index + 1}`}
            width={1400}
            height={900}
            className="rounded-xl object-contain"
            style={{ maxHeight: "85vh", width: "auto" }}
          />
        </motion.div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === index ? "var(--em)" : "rgba(255,255,255,0.2)",
                transform: i === index ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
