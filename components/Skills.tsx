"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { skills, categoryColors } from "@/lib/data";

const spans = ["sm:col-span-3", "sm:col-span-3", "sm:col-span-2", "sm:col-span-4", "sm:col-span-2"];

export default function Skills() {
  const categories = Object.entries(skills);

  return (
    <section id="skills" className="relative z-2 py-14 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3">tech stack</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Tools & <span className="gtx">Teknologi</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Senjata yang saya pakai untuk membangun produk.</p>
        </motion.div>

        {/* Mobile: horizontal swipe carousel */}
        <div className="md:hidden snap-carousel">
          {categories.map(([cat, items], i) => {
            const color = categoryColors[cat] || "#10b981";
            return (
              <motion.div
                key={cat}
                className="snap-carousel-item bcard"
                initial={{ opacity: 0, scale: 0.93 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", stiffness: 280, damping: 22, delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: color }} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.07em" }}>
                    {cat}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))", gap: 10 }}>
                  {Object.entries(items).map(([key, skill]) => {
                    const SkillIcon = skill.Icon;
                    return (
                      <motion.div
                        key={key}
                        className="sicon flex flex-col items-center gap-1.5"
                        title={skill.name}
                        whileTap={{ scale: 0.82 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <div
                          className="sibg w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(27,37,54,.9)", border: "1px solid rgba(255,255,255,.07)" }}
                        >
                          {SkillIcon ? (
                            <SkillIcon size={22} />
                          ) : (
                            <Image src={skill.src!} alt={skill.name} width={22} height={22} style={{ objectFit: "contain" }} />
                          )}
                        </div>
                        <span style={{ fontSize: 9, color: "#475569", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>
                          {skill.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: swipe dots indicator */}
        <div className="md:hidden flex justify-center gap-1.5 mt-3 mb-1">
          {categories.map(([cat], i) => (
            <div
              key={cat}
              className="rounded-full"
              style={{
                width: i === 0 ? 16 : 5,
                height: 4,
                background: i === 0 ? "#cc0000" : "rgba(255,255,255,0.15)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-6 gap-5">
          {categories.map(([cat, items], i) => {
            const color = categoryColors[cat] || "#10b981";
            return (
              <motion.div
                key={cat}
                className={`bcard ${spans[i]}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: color }} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.07em" }}>
                    {cat}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(62px, 1fr))", gap: 12 }}>
                  {Object.entries(items).map(([key, skill]) => {
                    const SkillIcon = skill.Icon;
                    return (
                      <motion.div
                        key={key}
                        className="sicon flex flex-col items-center gap-1.5"
                        title={skill.name}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <div
                          className="sibg w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(27,37,54,.9)", border: "1px solid rgba(255,255,255,.07)" }}
                        >
                          {SkillIcon ? (
                            <SkillIcon size={26} />
                          ) : (
                            <Image src={skill.src!} alt={skill.name} width={26} height={26} style={{ objectFit: "contain" }} />
                          )}
                        </div>
                        <span style={{ fontSize: 10, color: "#475569", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>
                          {skill.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
