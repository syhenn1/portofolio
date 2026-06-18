"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiGithub } from "react-icons/fi";
import { timelineData, socialLinks } from "@/lib/data";
import { basePath } from "@/lib/basePath";
import CvModal from "@/components/CvModal";

const cvUrl = `${basePath}/assets/CV_Mochamad-Rifat-Syahman-Hambali.pdf`;

export default function About() {
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <section id="about" className="relative z-2 py-14 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3">about me</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Kenalan <span className="gtx">Dulu</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {/* Bio */}
          <motion.div
            className="lg:col-span-2 bcard"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-5 leading-tight">
              Hai! Saya <span className="gtx">Rifat Syahman</span>,
              <br />
              <span className="text-xl font-semibold text-gray-400">
                Software Developer dari Jakarta.
              </span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
              Seorang <span className="text-white font-semibold">Programmer</span> dengan pengalaman matang di bidang{" "}
              <span style={{ color: "var(--em)" }} className="font-semibold">software developing</span>. Fokus
              membangun aplikasi yang fungsional dan berdampak, baik dari sisi code quality maupun user experience.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm sm:text-base">
              Berpengalaman sebagai <span className="text-white font-semibold">ketua tim</span> di berbagai project.
              Terampil dengan Dart, PHP, Python, Laravel, dan Flutter. Juga antusias di bidang{" "}
              <span style={{ color: "#06b6d4" }} className="font-semibold">data analytics</span>.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm py-2.5 px-5"
              >
                <FiGithub size={16} />
                GitHub
              </a>
              <button
                onClick={() => setCvOpen(true)}
                className="btn-em text-sm py-2.5 px-5"
              >
                <FiEye size={16} />
                Lihat CV
              </button>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            className="bcard"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="mono text-xs mb-8" style={{ color: "var(--em)" }}>
              // my_journey[]
            </p>
            <div className="relative pl-7">
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: 1,
                  background: "linear-gradient(to bottom, #10b981, #06b6d4, #a78bfa)",
                }}
              />
              {timelineData.map((t) => (
                <div key={t.year} className="tl-item">
                  <div
                    className="tl-dot"
                    style={{ background: t.color, boxShadow: `0 0 10px ${t.color}80` }}
                  />
                  <div className="tl-card">
                    <span
                      className="mono"
                      style={{ fontSize: 10, color: t.color, fontWeight: 700, letterSpacing: "0.1em" }}
                    >
                      {t.year}
                    </span>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", margin: "3px 0 5px" }}>
                      {t.title}
                    </h4>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} pdfUrl={cvUrl} />
    </section>
  );
}
