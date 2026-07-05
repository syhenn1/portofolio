"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiGithub } from "react-icons/fi";
import { socialLinks } from "@/lib/data";
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
            Get to <span className="gtx">Know Me</span>
          </h2>
        </motion.div>

        {/* Bio */}
        <motion.div
          className="bcard flex flex-col justify-center mb-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
            Experienced as a <span className="font-semibold" style={{ color: "var(--tx)" }}>team lead</span> on various projects.
            Skilled with Dart, PHP, Python, Laravel, and Flutter. Also enthusiastic about{" "}
            <span style={{ color: "#06b6d4" }} className="font-semibold">data analytics</span>.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
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
              View CV
            </button>
          </div>
        </motion.div>
      </div>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} pdfUrl={cvUrl} />
    </section>
  );
}
