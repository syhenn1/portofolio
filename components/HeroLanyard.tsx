"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { basePath } from "@/lib/basePath";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useInView } from "@/lib/useInView";

const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

export default function HeroLanyard() {
  // Gate the actual mount (not just CSS visibility) behind a JS media query.
  // `hidden lg:block` alone still mounts the Canvas/physics world on mobile —
  // a display:none canvas keeps running its WebGL + Rapier render loop, which
  // is what was crashing Chrome on phones.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const ref = useRef<HTMLDivElement>(null);
  // Also unmount once the user has scrolled well past the hero — Projects
  // mounts its own Lanyard further down the page, and running two physics
  // worlds at once is exactly the "blow past the WebGL budget" scenario.
  const inView = useInView(ref, "600px 0px 600px 0px");

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-10 hidden lg:block pointer-events-none"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {isDesktop && inView && (
        <Lanyard
          frontImage={`${basePath}/images/ripat.png`}
          imageFit="cover"
          position={[0, 1.0, 20]}
          fov={13}
          lanyardWidth={0.9}
        />
      )}
    </div>
  );
}
