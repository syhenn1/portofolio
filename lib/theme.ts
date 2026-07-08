"use client";

import { useSyncExternalStore } from "react";

// Site-wide theme (default light, or the "AMD" black/red dark mode toggled
// from the intro screen). Mirrors the introState.ts pattern — a module-level
// external store instead of context, so any component (the toggle switch,
// MagneticCursor's accent color, etc.) can read/subscribe without a provider
// tree. Persisted to localStorage; the actual paint-time application happens
// twice: once synchronously via the inline anti-flash script in layout.tsx
// (before hydration, so there's no flash of the wrong theme), and again here
// so React-driven UI (e.g. the toggle's visual state) stays in sync.
export type Theme = "light" | "amd";

const STORAGE_KEY = "theme";
type Listener = () => void;

function readStored(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "amd" ? "amd" : "light";
  } catch {
    return "light";
  }
}

let current: Theme = typeof window !== "undefined" ? readStored() : "light";
const listeners = new Set<Listener>();

export function getTheme(): Theme {
  return current;
}

export function setTheme(theme: Theme) {
  current = theme;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(current === "amd" ? "light" : "amd");
}

function subscribe(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);
  return { theme, toggleTheme };
}
