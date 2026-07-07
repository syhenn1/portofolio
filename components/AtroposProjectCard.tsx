"use client";

import Image from "next/image";
import Link from "next/link";
import Atropos from "atropos/react";
import "atropos/css";
import { FiArrowUpRight } from "react-icons/fi";
import type { Project } from "@/lib/data";

interface Props {
  project: Project;
  href?: string;
  interactive?: boolean;
  // When set, a plain left-click hands off to this instead of navigating
  // immediately — used to scroll-to-focus a pile card's project before
  // moving on to its case study. Modified clicks (new tab, etc.) still work.
  onNavigate?: () => void;
}

// A single project's card — the image lives on Atropos's own parallax layers
// (background pulls back slightly, rim/text/arrow pop forward) so tilting on
// hover reads as genuine depth rather than a flat image reacting to CSS.
export default function AtroposProjectCard({ project, href, interactive = true, onNavigate }: Props) {
  const card = (
    <Atropos
      className="atropos-project"
      style={{ "--card-accent": project.color } as React.CSSProperties}
      activeOffset={interactive ? 34 : 0}
      shadow={false}
      highlight={interactive}
      rotateXMax={interactive ? 10 : 0}
      rotateYMax={interactive ? 10 : 0}
    >
      <div className="atropos-project-media" data-atropos-offset="-4">
        <Image src={project.img} alt={project.title} fill className="object-cover" sizes="420px" />
      </div>
      <div className="atropos-project-rim" data-atropos-offset="0" />
      <span className="mono atropos-project-year" data-atropos-offset="3">
        {project.year}
      </span>
      <div className="atropos-project-body" data-atropos-offset="6">
        <span className="mono atropos-project-badge">{project.sub}</span>
        <h3 className="atropos-project-title">{project.title}</h3>
      </div>
      <div className="atropos-project-arrow" data-atropos-offset="7">
        <FiArrowUpRight size={18} />
      </div>
    </Atropos>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="atropos-project-link"
      aria-label={project.title}
      onClick={(e) => {
        if (!onNavigate) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onNavigate();
      }}
    >
      {card}
    </Link>
  );
}
