import type Lenis from "lenis";

// SmoothScrollProvider owns the actual Lenis instance (created inside a
// useEffect, scoped to that component) — this is just a way for components
// elsewhere in the tree to reach it, e.g. to scroll-to-focus a project before
// navigating to its case study.
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}
