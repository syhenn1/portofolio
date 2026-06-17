"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { skills, categoryColors } from "@/lib/data";

const spans = ["sm:col-span-3", "sm:col-span-3", "sm:col-span-2", "sm:col-span-4", "sm:col-span-2"];

export default function Skills() {
  return (
    <section id="skills" className="py-14 px-3 sm:px-5" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3">tech stack</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Tools & <span className="gtx">Teknologi</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Senjata yang saya pakai untuk membangun produk.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-5">
          {Object.entries(skills).map(([cat, items], i) => {
            const color = categoryColors[cat] || "#10b981";
            return (
              <motion.div
                key={cat}
                className={`bcard ${spans[i]}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
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
                      <div key={key} className="sicon flex flex-col items-center gap-1.5" title={skill.name}>
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
                      </div>
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
