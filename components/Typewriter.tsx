"use client";

import { useEffect, useState } from "react";
import { roles } from "@/lib/data";

export default function Typewriter() {
  const [text, setText] = useState("");

  useEffect(() => {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = `"${roles[roleIndex]}"`;
      setText(current.slice(0, charIndex + (deleting ? 0 : 1)));

      if (!deleting) {
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          timeout = setTimeout(tick, 2000);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          charIndex = 0;
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      timeout = setTimeout(tick, deleting ? 50 : 70);
    };

    timeout = setTimeout(tick, 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <span style={{ color: "var(--tx)" }}>{text}</span>
      <span className="cur" />
    </>
  );
}
