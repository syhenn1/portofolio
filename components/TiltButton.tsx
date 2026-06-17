"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type MouseEvent, type ReactNode } from "react";

export default function TiltButton({
  href,
  target,
  rel,
  children,
  className,
  style,
}: {
  href: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [16, -16]), { stiffness: 260, damping: 18 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-16, 16]), { stiffness: 260, damping: 18 });
  const glowX = useTransform(x, (v) => `${v * 100}%`);
  const glowY = useTransform(y, (v) => `${v * 100}%`);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(52,211,153,0.35), transparent 60%)`
  );

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function onMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.93, rotateX: 0, rotateY: 0 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 600,
        transformStyle: "preserve-3d",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: glowBackground,
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </motion.a>
  );
}
