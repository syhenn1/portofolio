"use client";

// A horizontally-swipeable card carousel — cards flip in place on click
// instead of opening a modal, and the track is drag-to-scroll (mouse) plus
// native touch-swipe, so there's no on-screen prev/next button competing
// with the fixed "back to top" button for the same corner of the screen.
import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

// Auto-slide speed, in pixels per second.
const AUTO_SLIDE_SPEED = 50;

export type CardType = {
  src?: string;
  color?: string;
  title: string;
  category: string;
  content: ReactNode;
};

// Shared with every Card so a drag-to-scroll gesture that happens to end
// over a card doesn't also register as a flip click.
const DragContext = createContext<React.RefObject<{ moved: boolean }> | null>(null);

export const Carousel = ({ items }: { items: ReactNode[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { isDown: true, startX: e.clientX, scrollLeft: track.scrollLeft, moved: false };
    // Pointer capture is deferred until real movement is detected — capturing
    // immediately on down retargets the eventual click to the track itself
    // (per the Pointer Events spec), which swallows taps on buttons inside
    // the card (e.g. "Tap for details") before they ever fire.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    const st = dragState.current;
    if (!st.isDown || !track) return;
    const delta = e.clientX - st.startX;
    if (Math.abs(delta) > 4) {
      if (!st.moved) track.setPointerCapture(e.pointerId);
      st.moved = true;
    }
    if (st.moved) track.scrollLeft = st.scrollLeft - delta;
  };

  const endDrag = (e: React.PointerEvent) => {
    const track = trackRef.current;
    dragState.current.isDown = false;
    if (track?.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
  };

  // Slow, continuous auto-scroll toward the end, looping back to the start.
  // Pauses only while the user is actively dragging the track.
  useEffect(() => {
    let rafId: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const track = trackRef.current;
      if (track && !dragState.current.isDown) {
        const max = track.scrollWidth - track.clientWidth;
        if (max > 0) {
          const next = track.scrollLeft + (AUTO_SLIDE_SPEED * dt) / 1000;
          track.scrollLeft = next >= max ? 0 : next;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <DragContext.Provider value={dragState}>
      <div
        ref={trackRef}
        className="flex w-full cursor-grab overflow-x-auto overscroll-x-contain py-4 active:cursor-grabbing md:py-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex flex-row justify-start gap-5">
          {items.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 * index, ease: "easeOut" }}
              key={"card" + index}
              className="shrink-0 rounded-3xl select-none last:pr-[5%] md:last:pr-[28%]"
              style={{ touchAction: "pan-y", WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </DragContext.Provider>
  );
};

export const Card = ({ card }: { card: CardType }) => {
  const [flipped, setFlipped] = useState(false);
  const dragState = useContext(DragContext);

  const handleClick = () => {
    // A drag that ended over the card shouldn't also register as a flip click.
    if (dragState?.current.moved) return;
    setFlipped((f) => !f);
  };

  return (
    <div className="relative h-96 w-60 md:h-[34rem] md:w-[22rem]" style={{ perspective: 1400 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front */}
        <button
          onClick={handleClick}
          className="absolute inset-0 flex flex-col items-start justify-start overflow-hidden rounded-3xl text-left"
          style={{ background: card.color ?? "var(--surf)", backfaceVisibility: "hidden" }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/55 via-transparent to-transparent" />
          <div className="relative z-40 p-6">
            <p className="text-left text-sm font-medium text-white/90">{card.category}</p>
            <p className="mt-2 max-w-xs text-left text-xl font-bold text-white [text-wrap:balance] md:text-2xl">{card.title}</p>
          </div>
          {card.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.src}
              alt=""
              draggable={false}
              className="absolute inset-0 z-10 h-full w-full object-cover"
              style={{ WebkitUserDrag: "none", touchAction: "pan-y" } as React.CSSProperties}
            />
          )}
          <span
            className="absolute bottom-4 right-4 z-40 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white/90"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
          >
            Tap for details
          </span>
        </button>

        {/* Back */}
        <button
          onClick={handleClick}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl p-5 text-left"
          style={{
            background: "var(--surf)",
            border: "1px solid var(--line)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-xs font-semibold" style={{ color: card.color ?? "var(--em)" }}>
            {card.category}
          </p>
          <p className="mt-2 font-bold" style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "var(--tx)" }}>
            {card.title}
          </p>
          <div className="mt-3 flex-1 overflow-y-auto">{card.content}</div>
        </button>
      </motion.div>
    </div>
  );
};
