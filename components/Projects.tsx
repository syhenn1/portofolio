"use client";

import { projects, socialLinks } from "@/lib/data";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import { MorphingHeroText } from "@/components/MorphingHeroText";

export default function Projects() {
  return (
    <PortfolioGallery
      id="projects"
      title={
        <MorphingHeroText
          front={
            <>
              <h2 className="text-3xl sm:text-5xl font-black text-balance">
                Featured <span className="gtx">Projects</span>
              </h2>
              <p className="text-gray-600 mt-3 max-w-md mx-auto text-sm">From web, mobile, to data — built with genuine care.</p>
            </>
          }
          back={
            <div className="text-center">
              <h2 className="text-3xl sm:text-5xl font-black text-balance">Look at my Projects! :D</h2>
              <p className="mt-3 max-w-md mx-auto text-sm">Click any photo to check it out!</p>
            </div>
          }
        />
      }
      archiveButton={{ text: "All on GitHub", href: socialLinks.github }}
      images={projects.map((p) => ({
        src: p.img,
        alt: p.title,
        title: p.title,
        href: `/projects/${p.slug}`,
      }))}
    />
  );
}
