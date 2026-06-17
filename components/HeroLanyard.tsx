"use client";

import dynamic from "next/dynamic";
import { basePath } from "@/lib/basePath";

const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

export default function HeroLanyard() {
  return (
    <div
      className="absolute inset-0 z-10 hidden lg:block pointer-events-none"
      style={{ height: "100vh" }}
    >
      <Lanyard
        frontImage={`${basePath}/images/ripat.png`}
        imageFit="contain"
        position={[0, 0, 20]}
        fov={16}
        lanyardWidth={1.6}
      />
    </div>
  );
}
