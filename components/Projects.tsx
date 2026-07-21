"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { projects, getSkill, socialLinks, type Project } from "@/lib/data";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import LearnMoreButton from "@/components/LearnMoreButton";

// ── Mobile card ────────────────────────────────────────────────────────────────
function MobileProjectCard({ project, i }: { project: Project; i: number }) {
  const techs = project.tech.slice(0, 4).map((k) => getSkill(k)).filter(Boolean);

  return (
    <motion.div
      className="snap-carousel-item"
      initial={{ opacity: 0, scale: 0.93 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-20px" }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: i * 0.05 }}
    >
      <Link href={`/projects/${project.slug}`} className="proj-card group h-full flex flex-col">
        <div className="relative shrink-0 h-44">
          <Image src={project.img} alt={project.title} fill className="proj-img object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10, 10, 10,.95) 0%, rgba(10, 10, 10,.1) 60%, transparent 100%)" }}
          />
          <span
            className="mono absolute top-3 left-3"
            style={{
              fontSize: 10, color: project.color,
              background: "rgba(0,0,0,.7)", padding: "3px 10px",
              borderRadius: 999, border: `1px solid ${project.color}45`,
            }}
          >
            {project.sub}
          </span>
          <div className="proj-arrow absolute top-3 right-3"><FiArrowUpRight size={16} /></div>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold leading-tight" style={{ color: "var(--tx)" }}>{project.title}</h3>
            <span className="mono text-[10px] shrink-0" style={{ color: "var(--muted)" }}>{project.year}</span>
          </div>
          <p
            className="text-gray-600 leading-relaxed"
            style={{ fontSize: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {techs.map((s, idx) => {
              const skill = s!;
              const SkillIcon = skill.Icon;
              return (
                <span key={idx} className="ttag" style={{ fontSize: 10 }}>
                  {SkillIcon
                    ? <SkillIcon size={10} />
                    : <Image src={skill.src!} alt={skill.name} width={10} height={10} style={{ objectFit: "contain" }} />}
                  {skill.name}
                </span>
              );
            })}
            {project.tech.length > techs.length && (
              <span className="ttag" style={{ fontSize: 10 }}>+{project.tech.length - techs.length}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Projects section ───────────────────────────────────────────────────────────
export default function Projects() {
  return (
    <section id="projects" className="relative z-2">

      {/* ── Desktop: parallax gallery, cards drift with the cursor ─────────── */}
      <div className="hidden md:block relative overflow-hidden" style={{ minHeight: "115vh" }}>
        <ParallaxHeroImages
          images={projects.map((p) => ({
            src: p.img,
            href: `/projects/${p.slug}`,
            label: p.title,
            sub: p.sub,
            color: p.color,
          }))}
        />

        <div
          className="relative z-10 flex flex-col items-center justify-center px-8 text-center pointer-events-none"
          style={{ minHeight: "115vh" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="slabel mb-3">featured work</div>
            <h2 className="text-4xl sm:text-6xl font-black">
              Featured <span className="gtx">Projects</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-md mx-auto text-sm">
              From web, mobile, to data — built with genuine care. Move your cursor to explore.
            </p>
            <div className="pointer-events-auto mt-7 flex items-center justify-center">
              <LearnMoreButton href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                All on GitHub
              </LearnMoreButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: horizontal snap carousel ────────────────────────────── */}
      <div className="md:hidden py-24 px-3 sm:px-5">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="slabel mb-2">featured work</div>
            <h2 className="text-3xl font-black">Featured <span className="gtx">Projects</span></h2>
          </div>
          <LearnMoreButton href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="mt-4 sm:mt-0 self-start">
            GitHub
          </LearnMoreButton>
        </motion.div>

        <div className="snap-carousel">
          {projects.map((project, i) => (
            <MobileProjectCard key={project.slug} project={project} i={i} />
          ))}
        </div>
      </div>

    </section>
  );
}
