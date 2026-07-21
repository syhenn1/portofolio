"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { basePath } from "@/lib/basePath";
import CvModal from "@/components/CvModal";
import LearnMoreButton from "@/components/LearnMoreButton";
import { MorphingHeroText } from "@/components/MorphingHeroText";

const cvUrl = `${basePath}/assets/CV_Mochamad-Rifat-Syahman-Hambali.pdf`;

export default function About() {
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <section id="about" className="relative z-2 pt-8 sm:pt-10 md:pt-32 pb-4 sm:pb-6 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3">about me</div>
          <MorphingHeroText
            front={
              <h2 className="text-3xl sm:text-5xl font-black">
                Get to <span className="gtx">Know Me</span>
              </h2>
            }
            back={<h2 className="text-3xl sm:text-5xl font-black">Hi There! :)</h2>}
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          className="bcard flex flex-col justify-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
            Experienced as a <span className="font-semibold" style={{ color: "var(--tx)" }}>team lead</span> on various software projects.
            Skilled with TypeScript, Next.js, Python, Laravel, and Flutter, with a strong focus on{" "}
            <span style={{ color: "#06b6d4" }} className="font-semibold">software development</span> and{" "}
            <span style={{ color: "#06b6d4" }} className="font-semibold">data analysis</span>.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
            <LearnMoreButton onClick={() => setCvOpen(true)}>View CV</LearnMoreButton>
          </div>
        </motion.div>
      </div>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} pdfUrl={cvUrl} />
    </section>
  );
}
