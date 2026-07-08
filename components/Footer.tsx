import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { socialLinks } from "@/lib/data";
import { basePath } from "@/lib/basePath";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-2" style={{ background: "var(--surf)", borderTop: "1px solid var(--line)" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-12 flex flex-col sm:flex-row sm:items-start justify-between gap-10">
        <div>
          <span className="mono text-sm font-bold">
            <span style={{ color: "var(--placeholder)" }}>&lt;</span>
            <span style={{ color: "var(--tx)" }}>rifat</span>
            <span style={{ color: "var(--em)" }}>/&gt;</span>
          </span>
          <p className="text-sm text-gray-600 mt-3 max-w-xs leading-relaxed">
            Software Developer from Jakarta — building web, mobile, and data products with genuine care.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
          <div>
            <p className="mono text-xs mb-4" style={{ color: "var(--em)" }}>navigate</p>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a key={link.href} href={`${basePath}/${link.href}`} className="nav-link text-sm w-fit">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mono text-xs mb-4" style={{ color: "var(--em)" }}>connect</p>
            <div className="flex gap-3">
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="soc" aria-label="GitHub" data-magnetic="">
                <FiGithub size={16} />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="soc" aria-label="LinkedIn" data-magnetic="">
                <FiLinkedin size={16} />
              </a>
              <a href={`mailto:${socialLinks.email}`} className="soc" aria-label="Email" data-magnetic="">
                <FiMail size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-5">
        <p className="text-xs text-center sm:text-left" style={{ color: "var(--muted)" }}>
          &copy; 2025 Mochamad Rifat Syahman Hambali. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
