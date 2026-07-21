"use client";

// Adapted from a shadcn-style "portfolio gallery" snippet — retheme to the
// site's CSS-variable palette (no bg-background/foreground/border tokens
// here) and reuse LearnMoreButton/glass for visual consistency with the
// rest of the page. Desktop gets the 3D overlapping stack; mobile falls
// back to an auto-scrolling marquee row.
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import LearnMoreButton from "@/components/LearnMoreButton";

export interface PortfolioGalleryImage {
  src: string;
  alt: string;
  title?: string;
  href?: string;
}

interface PortfolioGalleryProps {
  id?: string;
  label?: string;
  title?: ReactNode;
  subtitle?: string;
  archiveButton?: {
    text: string;
    href: string;
  };
  images: PortfolioGalleryImage[];
  className?: string;
  maxHeight?: number;
  spacing?: string;
  onImageClick?: (index: number) => void;
  /** Whether to pause marquee animation on hover (mobile only) @default true */
  pauseOnHover?: boolean;
  /** Number of times to repeat the content in marquee (mobile only) @default 4 */
  marqueeRepeat?: number;
}

function GalleryTile({
  image,
  className,
  onClick,
  children,
}: {
  image: PortfolioGalleryImage;
  className: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const tile = (
    <div className={className} onClick={onClick}>
      <div
        className="relative aspect-video rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{
          boxShadow: `
            rgba(0, 0, 0, 0.01) 0.796192px 0px 0.796192px 0px,
            rgba(0, 0, 0, 0.03) 2.41451px 0px 2.41451px 0px,
            rgba(0, 0, 0, 0.08) 6.38265px 0px 6.38265px 0px,
            rgba(0, 0, 0, 0.25) 20px 0px 20px 0px
          `,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover object-left-top"
          loading="lazy"
          decoding="async"
        />
        {image.title && (
          <div
            className="absolute inset-x-0 bottom-0 p-3"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,.85) 0%, transparent 100%)" }}
          >
            <span className="text-sm font-bold text-white">{image.title}</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );

  return image.href ? (
    <Link href={image.href} className="contents" aria-label={image.title}>
      {tile}
    </Link>
  ) : (
    tile
  );
}

export function PortfolioGallery({
  id = "archives",
  label,
  title = "Browse my library",
  subtitle,
  archiveButton,
  images,
  className = "",
  maxHeight = 120,
  spacing = "-space-x-80 md:-space-x-96",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className={`relative z-2 py-24 sm:py-32 px-3 sm:px-5 ${className}`} id={id}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative z-10 text-center pb-10 sm:pb-12 px-6 sm:px-8">
          {label && <div className="slabel mb-3">{label}</div>}
          {typeof title === "string" ? (
            <h2 className="text-3xl sm:text-5xl font-black text-balance">{title}</h2>
          ) : (
            title
          )}
          {subtitle && <p className="text-gray-600 mt-3 max-w-md mx-auto text-sm">{subtitle}</p>}
          {archiveButton && (
            <div className="mt-7 flex items-center justify-center">
              <LearnMoreButton href={archiveButton.href} target="_blank" rel="noopener noreferrer">
                {archiveButton.text}
              </LearnMoreButton>
            </div>
          )}
        </div>

        {/* Desktop 3D overlapping layout — cards fan out at varying
            heights (closer to the middle floats higher), no shadow, no
            card/border container. */}
        <div className="hidden md:block relative h-[460px] overflow-hidden">
          <div className={`flex ${spacing} pb-8 pt-40 items-end justify-center`}>
            {images.map((image, index) => {
              const totalImages = images.length;
              const middle = Math.floor(totalImages / 2);
              const distanceFromMiddle = Math.abs(index - middle);
              const staggerOffset = maxHeight - distanceFromMiddle * 20;
              const zIndex = totalImages - index;
              const isHovered = hoveredIndex === index;
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
              const yOffset = isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset;

              return (
                <motion.div
                  key={index}
                  className="group cursor-pointer flex-shrink-0"
                  style={{ zIndex }}
                  initial={{ transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`, opacity: 0 }}
                  animate={{ transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`, opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <GalleryTile
                    image={image}
                    className="w-80 md:w-96 lg:w-[30rem]"
                    onClick={() => onImageClick?.(index)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile marquee layout */}
        <div className="block md:hidden relative pb-4">
          <div className={cn("group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]", "flex-row")}>
            {Array(marqueeRepeat)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={cn("flex shrink-0 justify-around [gap:var(--gap)]", "animate-marquee flex-row", {
                    "group-hover:[animation-play-state:paused]": pauseOnHover,
                  })}
                >
                  {images.map((image, index) => (
                    <GalleryTile
                      key={`${i}-${index}`}
                      image={image}
                      className="group cursor-pointer flex-shrink-0 w-64"
                      onClick={() => onImageClick?.(index)}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
