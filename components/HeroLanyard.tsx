"use client";

import dynamic from "next/dynamic";
import { basePath } from "@/lib/basePath";

const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

export default function HeroLanyard() {
  return (
    <div
      className="absolute inset-y-0 right-0 z-10 hidden lg:block pointer-events-none"
      style={{
        width: "55%",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <Lanyard
        frontImage={`${basePath}/images/ripat.png`}
        imageFit="cover"
        position={[0, 1.0, 20]}
        fov={13}
        lanyardWidth={0.9}
      />
    </div>
  );
}
