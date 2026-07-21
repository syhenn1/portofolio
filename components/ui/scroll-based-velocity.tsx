"use client";

// Adapted from Magic UI's "Scroll Based Velocity" marquee. Always animating
// via useAnimationFrame (a constant baseVelocity drift, independent of
// scroll) — scrolling just speeds it up/slows it down/reverses it on top of
// that, it's never required to see it move.
import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

interface ScrollVelocityRowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  baseVelocity: number;
  direction?: 1 | -1;
}

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  ...props
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef(1);
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy * direction);
  });

  return (
    <div className="w-full overflow-hidden whitespace-nowrap" {...props}>
      <motion.div className={cn("inline-block", className)} style={{ x }}>
        <span className="pr-4" ref={copyRef}>
          {children}
        </span>
        <span className="pr-4">{children}</span>
        <span className="pr-4">{children}</span>
        <span className="pr-4">{children}</span>
      </motion.div>
    </div>
  );
}
