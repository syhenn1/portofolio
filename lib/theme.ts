"use client";

import { useSyncExternalStore } from "react";

// Site-wide theme — three modes: "bw" (black & white, default), "light" (the
// orange "STD" look), and "amd" (black/red dark mode). Mirrors the
// introState.ts pattern — a module-level external store instead of context,
// so any component (the toggle switch, MagneticCursor's accent color, etc.)
// can read/subscribe without a provider tree. Persisted to localStorage; the
// actual paint-time application happens twice: once synchronously via the
// inline anti-flash script in layout.tsx (before hydration, so there's no
// flash of the wrong theme), and again here so React-driven UI (e.g. the
// toggle's visual state) stays in sync.
export type Theme = "bw" | "light" | "amd";

const THEMES: Theme[] = ["bw", "light", "amd"];
const STORAGE_KEY = "theme";
type Listener = () => void;

function readStored(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (THEMES as string[]).includes(stored ?? "") ? (stored as Theme) : "bw";
  } catch {
    return "bw";
  }
}

let current: Theme = typeof window !== "undefined" ? readStored() : "bw";
const listeners = new Set<Listener>();

export function getTheme(): Theme {
  return current;
}

export function setTheme(theme: Theme) {
  current = theme;
  // "bw" is the unmarked default (matches :root in globals.css), so only
  // "light"/"amd" need the attribute — same anti-flash contract as before.
  if (theme === "bw") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  listeners.forEach((l) => l());
}

export function cycleTheme() {
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  setTheme(next);
}

// Kept for older call sites — now just cycles through all three modes.
export const toggleTheme = cycleTheme;

function subscribe(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getServerSnapshot(): Theme {
  return "bw";
}

export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void; cycleTheme: () => void } {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);
  return { theme, setTheme, cycleTheme };
}
