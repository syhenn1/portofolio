"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { CometCard } from "@/components/ui/comet-card";
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

// A single project's card, tilt handled by CometCard (3D tilt + moving glare
// toward the cursor) instead of Atropos's layered parallax.
export default function CometProjectCard({ project, href, interactive = true, onNavigate }: Props) {
  const media = (
    <div className="comet-project" style={{ "--card-accent": project.color } as React.CSSProperties}>
      <div className="comet-project-media">
        <Image src={project.img} alt={project.title} fill className="object-cover" sizes="420px" />
      </div>
      <div className="comet-project-rim" />
      <span className="mono comet-project-year">{project.year}</span>
      <div className="comet-project-body">
        <span className="mono comet-project-badge">{project.sub}</span>
        <h3 className="comet-project-title">{project.title}</h3>
      </div>
      <div className="comet-project-arrow">
        <FiArrowUpRight size={18} />
      </div>
    </div>
  );

  const card = interactive ? (
    <CometCard className="h-full w-full">{media}</CometCard>
  ) : (
    media
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="comet-project-link"
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
