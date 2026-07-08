"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck, FiMail } from "react-icons/fi";
import { getAdjacentProjects, getSkill, socialLinks, type Project } from "@/lib/data";
import ImageLightbox from "@/components/ImageLightbox";
import LearnMoreButton from "@/components/LearnMoreButton";

export default function ProjectDetail({ project }: { project: Project }) {
  const { prev, next } = getAdjacentProjects(project.slug);
  const techs = project.tech.map((k) => getSkill(k)).filter(Boolean);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const screenshots = project.screenshots ?? [];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevImg = useCallback(() => setLightboxIdx((i) => (i !== null ? (i - 1 + screenshots.length) % screenshots.length : null)), [screenshots.length]);
  const nextImg = useCallback(() => setLightboxIdx((i) => (i !== null ? (i + 1) % screenshots.length : null)), [screenshots.length]);

  return (
    <main style={{ background: "var(--bg)" }}>
      {/* Sticky background image */}
      <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ zIndex: 0 }}>
        <Image src={project.img} alt={project.title} fill className="object-cover object-top" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg) 0%, rgba(10, 10, 10,.72) 38%, rgba(10, 10, 10,.1) 70%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,.7) 0%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 80%, color-mix(in srgb, var(--em) 16%, transparent) 0%, transparent 55%), linear-gradient(160deg, color-mix(in srgb, var(--em) 8%, transparent) 0%, transparent 45%)" }} />
      </div>

      {/* Title block — scrolls over the sticky image */}
      <div className="relative z-1" style={{ marginTop: "min(-32vh, -260px)" }}>
        <div className="px-3 sm:px-5 pb-12 sm:pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link href="/#projects" className="inline-flex items-center gap-2 mono text-xs mb-8" style={{ color: "var(--muted)" }}>
                <FiArrowLeft size={14} />
                Back to Projects
              </Link>
            </motion.div>
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-5 mono"
              style={{ fontSize: 12 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <span
                style={{
                  color: project.color,
                  borderBottom: `2px solid ${project.color}`,
                  paddingBottom: 3,
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {project.category}
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
              <span style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>{project.year}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
              <span style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>{project.role}</span>
            </motion.div>
            <motion.h1
              className="font-black leading-none text-white"
              style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {project.title}
            </motion.h1>
            <motion.p
              className="text-gray-300 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {project.desc}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-16 sm:py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            <motion.div
              className="lg:col-span-2 space-y-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <div className="slabel mb-3">the problem</div>
                <p className="text-gray-700 leading-relaxed">{project.problem}</p>
              </div>
              <div>
                <div className="slabel mb-3">the solution</div>
                <p className="text-gray-700 leading-relaxed">{project.solution}</p>
              </div>
              <div>
                <div className="slabel mb-3">key features</div>
                <div className="space-y-3">
                  {project.features.map((f) => (
                    <div key={f} className="feature-item">
                      <FiCheck size={16} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="meta-card">
                <div className="meta-row" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
                  <p className="mono text-xs mb-1" style={{ color: "var(--em)" }}>role</p>
                  <p className="text-sm text-gray-700 font-medium">{project.role}</p>
                </div>
                <div className="meta-row">
                  <p className="mono text-xs mb-1" style={{ color: "var(--em)" }}>year</p>
                  <p className="text-sm text-gray-700 font-medium">{project.year}</p>
                </div>
                <div className="meta-row">
                  <p className="mono text-xs mb-1" style={{ color: "var(--em)" }}>category</p>
                  <p className="text-sm text-gray-700 font-medium">{project.category}</p>
                </div>
                <div className="meta-row">
                  <p className="mono text-xs mb-2" style={{ color: "var(--em)" }}>tech stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {techs.map((s, idx) => {
                      const skill = s!;
                      const SkillIcon = skill.Icon;
                      return (
                        <span key={idx} className="ttag">
                          {SkillIcon ? (
                            <SkillIcon size={11} />
                          ) : (
                            <Image src={skill.src!} alt={skill.name} width={11} height={11} style={{ objectFit: "contain" }} />
                          )}
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <LearnMoreButton href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-full justify-center">
                View GitHub Profile
              </LearnMoreButton>
              <Link href="/#contact" className="btn-em w-full justify-center">
                <FiMail size={16} />
                Discuss a Project
              </Link>
            </motion.div>
          </div>

          {screenshots.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="slabel mb-5">screenshots</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {screenshots.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    className="relative group rounded-sm overflow-hidden cursor-zoom-in"
                    style={{ border: "1px solid var(--line)" }}
                  >
                    <Image
                      src={src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      width={600}
                      height={400}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.4)" }}
                    >
                      <span className="mono text-xs text-white/80">Click to zoom</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {lightboxIdx !== null && (
            <ImageLightbox
              images={screenshots}
              index={lightboxIdx}
              onClose={closeLightbox}
              onPrev={prevImg}
              onNext={nextImg}
            />
          )}

          <div className="grid sm:grid-cols-2 gap-5 mt-20">
            <Link href={`/projects/${prev.slug}`} className="nav-card">
              <span className="mono text-xs" style={{ color: "var(--muted)" }}>
                <FiArrowLeft size={12} style={{ display: "inline", marginRight: 6 }} />
                previous
              </span>
              <span className="text-lg font-bold" style={{ color: "var(--tx)" }}>{prev.title}</span>
            </Link>
            <Link href={`/projects/${next.slug}`} className="nav-card sm:items-end sm:text-right">
              <span className="mono text-xs" style={{ color: "var(--muted)" }}>
                next
                <FiArrowRight size={12} style={{ display: "inline", marginLeft: 6 }} />
              </span>
              <span className="text-lg font-bold" style={{ color: "var(--tx)" }}>{next.title}</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
