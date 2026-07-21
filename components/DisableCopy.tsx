"use client";

import { useEffect } from "react";

// Belt-and-suspenders for the site-wide `user-select: none` in globals.css —
// blocks copy/cut and the right-click menu too, so text can't be lifted off
// the page even via keyboard shortcuts on unselected content.
export default function DisableCopy() {
  useEffect(() => {
    const isFormField = (target: EventTarget | null) =>
      target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

    const block = (e: Event) => {
      if (!isFormField(e.target)) e.preventDefault();
    };
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  return null;
}
