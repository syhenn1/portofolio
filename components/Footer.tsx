import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { socialLinks } from "@/lib/data";
import { basePath } from "@/lib/basePath";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-2" style={{ background: "var(--surf)", borderTop: "1px solid rgba(255,255,255,.04)" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-12 flex flex-col sm:flex-row sm:items-start justify-between gap-10">
        <div>
          <span className="mono text-sm font-bold">
            <span style={{ color: "#475569" }}>&lt;</span>
            <span className="text-white">rifat</span>
            <span style={{ color: "var(--em)" }}>/&gt;</span>
          </span>
          <p className="text-sm text-gray-500 mt-3 max-w-xs leading-relaxed">
            Software Developer dari Jakarta — membangun produk web, mobile, dan data dengan sungguh-sungguh.
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
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="soc" aria-label="GitHub">
                <FiGithub size={16} />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="soc" aria-label="LinkedIn">
                <FiLinkedin size={16} />
              </a>
              <a href={`mailto:${socialLinks.email}`} className="soc" aria-label="Email">
                <FiMail size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="divline" />

      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-5">
        <p className="text-xs text-center sm:text-left" style={{ color: "#334155" }}>
          &copy; 2025 Mochamad Rifat Syahman Hambali. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
