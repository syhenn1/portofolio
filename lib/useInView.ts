"use client";

import { useEffect, useState, type RefObject } from "react";

// Whether `ref`'s element currently intersects the viewport (+ rootMargin).
// Used to gate expensive mounts (WebGL/physics canvases) so only the one the
// user is actually near stays alive — running two Lanyard/Rapier worlds at
// once blows past the browser's live WebGL-context budget (see Lanyard.tsx).
export function useInView(ref: RefObject<HTMLElement | null>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
