"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck, FiGithub, FiMail } from "react-icons/fi";
import { getAdjacentProjects, getSkill, socialLinks, type Project } from "@/lib/data";

const heroBadgeStyle = {
  background: "rgba(27,37,54,.55)",
  borderColor: "rgba(255,255,255,.14)",
  backdropFilter: "blur(8px)",
} as const;

export default function ProjectDetail({ project }: { project: Project }) {
  const { prev, next } = getAdjacentProjects(project.slug);
  const techs = project.tech.map((k) => getSkill(k)).filter(Boolean);

  return (
    <main style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: "min(88vh, 760px)", minHeight: 480 }}>
        <Image src={project.img} alt={project.title} fill className="object-cover" priority />
        {/* Bottom fade — warm dark, matches var(--bg) */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--bg) 0%, rgba(14,9,5,.72) 38%, rgba(14,9,5,.1) 70%, transparent 100%)" }}
        />
        {/* Left vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(12,6,3,.75) 0%, transparent 60%)" }}
        />
        {/* Red color tint */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 80%, rgba(204,0,0,.22) 0%, transparent 55%), linear-gradient(160deg, rgba(204,0,0,.1) 0%, transparent 45%)" }}
        />

        {/* Back link */}
        <motion.div
          className="absolute top-0 inset-x-0 px-3 sm:px-5 pt-24 sm:pt-28 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-5xl mx-auto">
            <Link href="/#projects" className="inline-flex items-center gap-2 mono text-xs" style={{ color: "var(--muted)" }}>
              <FiArrowLeft size={14} />
              Kembali ke Projects
            </Link>
          </div>
        </motion.div>

        {/* Title block */}
        <div className="absolute bottom-0 inset-x-0 px-3 sm:px-5 pb-12 sm:pb-16 z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-wrap items-center gap-2 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <span className="badge" style={{ ...heroBadgeStyle, color: project.color, borderColor: `${project.color}45` }}>
                {project.category}
              </span>
              <span className="badge" style={heroBadgeStyle}>{project.year}</span>
              <span className="badge" style={heroBadgeStyle}>{project.role}</span>
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
      </section>

      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-16 sm:py-20">
        {/* Content grid */}
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
              <p className="text-gray-300 leading-relaxed">{project.problem}</p>
            </div>
            <div>
              <div className="slabel mb-3">the solution</div>
              <p className="text-gray-300 leading-relaxed">{project.solution}</p>
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
                <p className="text-sm text-gray-300 font-medium">{project.role}</p>
              </div>
              <div className="meta-row">
                <p className="mono text-xs mb-1" style={{ color: "var(--em)" }}>year</p>
                <p className="text-sm text-gray-300 font-medium">{project.year}</p>
              </div>
              <div className="meta-row">
                <p className="mono text-xs mb-1" style={{ color: "var(--em)" }}>category</p>
                <p className="text-sm text-gray-300 font-medium">{project.category}</p>
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

            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center">
              <FiGithub size={16} />
              Lihat Profil GitHub
            </a>
            <Link href="/#contact" className="btn-em w-full justify-center">
              <FiMail size={16} />
              Diskusikan Project
            </Link>
          </motion.div>
        </div>

        {/* Prev/next nav */}
        <div className="grid sm:grid-cols-2 gap-5 mt-20">
          <Link href={`/projects/${prev.slug}`} className="nav-card">
            <span className="mono text-xs" style={{ color: "var(--muted)" }}>
              <FiArrowLeft size={12} style={{ display: "inline", marginRight: 6 }} />
              previous
            </span>
            <span className="text-lg font-bold text-white">{prev.title}</span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="nav-card sm:items-end sm:text-right">
            <span className="mono text-xs" style={{ color: "var(--muted)" }}>
              next
              <FiArrowRight size={12} style={{ display: "inline", marginLeft: 6 }} />
            </span>
            <span className="text-lg font-bold text-white">{next.title}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
