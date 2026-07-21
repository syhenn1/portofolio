"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { timelineData } from "@/lib/data";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery-2";
import { useIsClient } from "@/lib/useIsClient";
import { MorphingHeroText } from "@/components/MorphingHeroText";

// WebGL curved gallery — details for whichever card is under the cursor
// show up in a small pill that follows the pointer.
//
// Two gotchas this works around:
// - `items` must stay referentially stable, or every mousemove-triggered
//   re-render would recreate the WebGL app (it was — tearing the GL
//   context down mid-frame reliably rendered the canvas solid black).
// - The tooltip is `position: fixed`, but everything under <PageTransition>
//   sits inside an animated motion.div, which becomes its containing
//   block and breaks fixed positioning (same caveat ScrollProgress/BackToTop
//   already route around in layout.tsx). Portalling straight to
//   document.body escapes it.
export default function JourneyTimeline() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const mounted = useIsClient();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const items: GalleryItem[] = useMemo(
    () => timelineData.map((t) => ({ image: t.images?.[0]?.src ?? "" })),
    []
  );

  const entry = hovered !== null ? timelineData[hovered] : null;
  const selectedEntry = selected !== null ? timelineData[selected] : null;

  return (
    <section className="relative z-2 pt-24 sm:pt-32 pb-32 sm:pb-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="slabel mb-3">career & growth</div>
          <MorphingHeroText
            front={
              <>
                <h2 className="text-3xl sm:text-5xl font-black">
                  My <span className="gtx">Journey</span>
                </h2>
                <p className="text-gray-600 mt-2 text-sm">Drag or scroll to browse.</p>
              </>
            }
            back={
              <>
                <h2 className="text-3xl sm:text-5xl font-black">Buckle Up! :D</h2>
                <p className="mt-2 text-sm">Click any card to focus it and read the full story!</p>
              </>
            }
          />

          {/* Fixed height so a selected entry's details never push the
              gallery below up or down; empty until a card is clicked.
              Entries are absolutely positioned so switching between two
              different entries crossfades in place instead of both being
              in normal flow at once (which briefly doubled the height and
              shoved the gallery down). */}
          <div className="relative mt-3" style={{ minHeight: 108 }}>
            <AnimatePresence>
              {selectedEntry && (
                <motion.div
                  key={selected}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono text-xs font-semibold" style={{ color: selectedEntry.color }}>
                      {selectedEntry.year}
                    </span>
                    <span className="font-bold text-sm" style={{ color: "var(--tx)" }}>
                      {selectedEntry.title}
                    </span>
                  </div>
                  <p
                    className="text-gray-600 mt-1.5 text-sm leading-relaxed max-w-4xl"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {selectedEntry.desc}
                  </p>
                  {selectedEntry.skills && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedEntry.skills.map((skill) => (
                        <span key={skill} className="ttag" style={{ fontSize: 10 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div
        className="relative h-[360px] sm:h-[440px] md:h-[520px] w-full"
        onMouseMove={(e) => {
          // clientX/Y are zoomed visual pixels, but `left`/`top` land in the
          // unzoomed local space (html { zoom: 1.3 } on desktop — see
          // globals.css), so raw client coords drift further off the real
          // cursor the further you are from the top-left corner. Same
          // compensation MagneticCursor/AsciiImageHover already apply.
          const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
          mx.set(e.clientX / zoom + 18);
          my.set(e.clientY / zoom + 18);
        }}
      >
        <CircularGallery items={items} bend={3} borderRadius={0.05} onHover={setHovered} onSelect={setSelected} />
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {entry && (
              <motion.div
                key={hovered}
                className="glass pointer-events-none fixed z-[999] hidden md:inline-flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-3 pr-4"
                style={{ left: mx, top: my }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.12 }}
              >
                <span className="mono shrink-0" style={{ fontSize: 9, color: entry.color }}>
                  {entry.year}
                </span>
                <span
                  className="truncate font-bold"
                  style={{ fontSize: 11, color: "var(--tx)", maxWidth: 220 }}
                >
                  {entry.title}
                </span>
                {entry.skills?.slice(0, 3).map((skill) => (
                  <span key={skill} className="ttag shrink-0" style={{ fontSize: 9 }}>
                    {skill}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
