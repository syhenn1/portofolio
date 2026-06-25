"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { projects, getSkill, socialLinks, type Project } from "@/lib/data";

const spans = [
  "sm:col-span-4",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-4",
  "sm:col-span-3",
  "sm:col-span-3",
  "sm:col-span-2",
  "sm:col-span-4",
];

function ProjectCard({ project, featured, span, i }: { project: Project; featured: boolean; span: string; i: number }) {
  const techs = project.tech.slice(0, featured ? 6 : 4).map((k) => getSkill(k)).filter(Boolean);

  return (
    <motion.div
      className={span}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, delay: i * 0.07 }}
    >
      <Link href={`/projects/${project.slug}`} className="proj-card group">
        <div className={`relative shrink-0 ${featured ? "h-64 sm:h-80" : "h-44 sm:h-52"}`}>
          <Image src={project.img} alt={project.title} fill className="proj-img object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(27,37,54,.92) 0%, rgba(27,37,54,.1) 60%, transparent 100%)" }}
          />
          <div className="absolute top-3 left-3">
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: project.color,
                background: "rgba(0,0,0,.6)",
                padding: "3px 11px",
                borderRadius: 999,
                border: `1px solid ${project.color}45`,
              }}
            >
              {project.sub}
            </span>
          </div>
          <div className="proj-arrow absolute top-3 right-3">
            <FiArrowUpRight size={18} />
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5 gap-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className={featured ? "text-2xl font-black text-white" : "text-lg font-bold text-white"}>
              {project.title}
            </h3>
            <span className="mono text-xs" style={{ color: "#475569" }}>
              {project.year}
            </span>
          </div>
          <p
            className="text-gray-400 leading-relaxed"
            style={{
              fontSize: 13,
              display: "-webkit-box",
              WebkitLineClamp: featured ? 3 : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
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
            {project.tech.length > techs.length && (
              <span className="ttag">+{project.tech.length - techs.length}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function MobileProjectCard({ project, i }: { project: Project; i: number }) {
  const techs = project.tech.slice(0, 4).map((k) => getSkill(k)).filter(Boolean);

  return (
    <motion.div
      className="snap-carousel-item"
      initial={{ opacity: 0, scale: 0.93 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: i * 0.05 }}
    >
      <Link href={`/projects/${project.slug}`} className="proj-card group h-full flex flex-col">
        <div className="relative shrink-0 h-44">
          <Image src={project.img} alt={project.title} fill className="proj-img object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(14,9,5,.95) 0%, rgba(14,9,5,.1) 60%, transparent 100%)" }}
          />
          <div className="absolute top-3 left-3">
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: project.color,
                background: "rgba(0,0,0,.7)",
                padding: "3px 10px",
                borderRadius: 999,
                border: `1px solid ${project.color}45`,
              }}
            >
              {project.sub}
            </span>
          </div>
          <div className="proj-arrow absolute top-3 right-3">
            <FiArrowUpRight size={16} />
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white leading-tight">{project.title}</h3>
            <span className="mono text-[10px] shrink-0" style={{ color: "#475569" }}>{project.year}</span>
          </div>
          <p
            className="text-gray-400 leading-relaxed"
            style={{
              fontSize: 12,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {techs.map((s, idx) => {
              const skill = s!;
              const SkillIcon = skill.Icon;
              return (
                <span key={idx} className="ttag" style={{ fontSize: 10 }}>
                  {SkillIcon ? (
                    <SkillIcon size={10} />
                  ) : (
                    <Image src={skill.src!} alt={skill.name} width={10} height={10} style={{ objectFit: "contain" }} />
                  )}
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

export default function Projects() {
  return (
    <section id="projects" className="relative z-2 py-14 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="slabel mb-3">featured work</div>
            <h2 className="text-3xl sm:text-5xl font-black">
              Projects <span className="gtx">Unggulan</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Dari web, mobile, hingga data — dibangun dengan sungguh-sungguh.
            </p>
          </div>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-5 sm:mt-0 self-start text-sm"
          >
            <FiGithub size={16} />
            All on GitHub
          </a>
        </motion.div>

        {/* Mobile: horizontal swipe carousel */}
        <div className="md:hidden snap-carousel">
          {projects.map((p, i) => (
            <MobileProjectCard key={p.slug} project={p} i={i} />
          ))}
        </div>

        {/* Mobile: swipe indicator */}
        <div className="md:hidden flex justify-center gap-1.5 mt-3 mb-1">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className="rounded-full"
              animate={{ width: i === 0 ? 16 : 5, backgroundColor: i === 0 ? "#cc0000" : "rgba(255,255,255,0.15)" }}
              style={{ height: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          ))}
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-6 gap-5">
          {projects.map((p, i) => {
            const span = spans[i] ?? "sm:col-span-3";
            const featured = span === "sm:col-span-4";
            return <ProjectCard key={p.slug} project={p} featured={featured} span={span} i={i} />;
          })}
        </div>
      </div>
    </section>
  );
}
