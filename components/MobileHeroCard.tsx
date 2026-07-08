"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { basePath } from "@/lib/basePath";

export default function MobileHeroCard() {
  return (
    <div className="flex lg:hidden justify-center mt-8 mb-2">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--em) 20%, transparent) 0%, color-mix(in srgb, var(--em) 8%, transparent) 50%, transparent 70%)" }}
        />

        {/* Card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          style={{
            width: 180,
            height: 230,
            border: "2px solid color-mix(in srgb, var(--em) 35%, transparent)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px color-mix(in srgb, var(--em) 15%, transparent)",
          }}
          animate={{ y: [0, -8, 0], rotate: [2, -1, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={`${basePath}/images/ripat.png`}
            alt="Rifat Syahman"
            fill
            className="object-cover"
          />
          {/* Bottom gradient overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, rgba(10, 10, 10,0.9), transparent)" }}
          />
          {/* Name tag */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="mono text-[10px] font-bold" style={{ color: "var(--em)" }}>rifat.syahman</p>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, transparent 50%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
