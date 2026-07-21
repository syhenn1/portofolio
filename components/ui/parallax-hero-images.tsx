"use client";

// Adapted from Aceternity UI's "Parallax Hero Images"
// (ui.aceternity.com/components/parallax-hero-images) — extended to accept
// clickable/labelled tiles (not just bare image URLs) so it can double as a
// project gallery, not only a decorative background.
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type ParallaxHeroImage =
  | string
  | {
      src: string;
      href?: string;
      label?: string;
      sub?: string;
      color?: string;
      alt?: string;
    };

interface ParallaxHeroImagesProps {
  images: ParallaxHeroImage[];
  className?: string;
}

type Slot = { top: string; left: string; w: number; h: number; depth: number; rotate: number };

// Scattered tile layout, tuned to leave the center clear for whatever
// heading/CTA a consumer layers on top. Depth controls parallax intensity —
// "closer" tiles (higher depth) swing further with the cursor.
const SLOTS: Slot[] = [
  { top: "6%", left: "6%", w: 270, h: 185, depth: 0.22, rotate: -4 },
  { top: "2%", left: "36%", w: 245, h: 260, depth: 0.55, rotate: 3 },
  { top: "8%", left: "66%", w: 285, h: 200, depth: 0.32, rotate: -3 },
  { top: "26%", left: "0%", w: 300, h: 200, depth: 0.7, rotate: 2 },
  { top: "28%", left: "78%", w: 275, h: 220, depth: 0.6, rotate: -2 },
  { top: "70%", left: "12%", w: 260, h: 180, depth: 0.4, rotate: 4 },
  { top: "66%", left: "40%", w: 300, h: 210, depth: 0.85, rotate: -3 },
  { top: "68%", left: "70%", w: 270, h: 185, depth: 0.3, rotate: 3 },
];

const MAX_SHIFT = 34;

function normalizeImage(image: ParallaxHeroImage) {
  return typeof image === "string" ? { src: image } : image;
}

function ParallaxTile({
  image,
  slot,
  mx,
  my,
}: {
  image: ReturnType<typeof normalizeImage>;
  slot: Slot;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const x = useTransform(mx, (v) => v * slot.depth * MAX_SHIFT);
  const y = useTransform(my, (v) => v * slot.depth * MAX_SHIFT);

  const tile = (
    <motion.div
      className="group absolute overflow-hidden rounded-2xl shadow-2xl"
      style={{ top: slot.top, left: slot.left, width: slot.w, height: slot.h, x, y, zIndex: Math.round(slot.depth * 10) }}
      initial={{ opacity: 0, scale: 0.85, rotate: slot.rotate }}
      whileInView={{ opacity: 1, scale: 1, rotate: slot.rotate }}
      viewport={{ once: false, margin: "-40px" }}
      whileHover={{ scale: 1.06, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <img src={image.src} alt={image.alt ?? image.label ?? ""} loading="lazy" className="h-full w-full object-cover" />
      {(image.label || image.sub) && (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(10,10,10,.92) 0%, rgba(10,10,10,.15) 65%, transparent 100%)" }}
        >
          {image.sub && (
            <span className="mono text-[10px]" style={{ color: image.color ?? "var(--em)" }}>
              {image.sub}
            </span>
          )}
          {image.label && <span className="text-sm font-bold text-white">{image.label}</span>}
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1.5px ${image.color ?? "rgba(255,255,255,.5)"}` }}
      />
    </motion.div>
  );

  if (image.href) {
    return (
      <Link href={image.href} className="contents" aria-label={image.label}>
        {tile}
      </Link>
    );
  }
  return tile;
}

export function ParallaxHeroImages({ images, className }: ParallaxHeroImagesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.4 });
  const my = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const items = images.map(normalizeImage);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("absolute inset-0", className)}
    >
      {items.map((image, i) => (
        <ParallaxTile key={`${image.src}-${i}`} image={image} slot={SLOTS[i % SLOTS.length]} mx={mx} my={my} />
      ))}
    </div>
  );
}
