import { FiGithub, FiLinkedin, FiInstagram, FiMail } from "react-icons/fi";
import { socialLinks } from "@/lib/data";
import { basePath } from "@/lib/basePath";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  { href: socialLinks.github, Icon: FiGithub, label: "GitHub" },
  { href: socialLinks.linkedin, Icon: FiLinkedin, label: "LinkedIn" },
  { href: socialLinks.instagram, Icon: FiInstagram, label: "Instagram" },
  { href: `mailto:${socialLinks.email}`, Icon: FiMail, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative z-2" style={{ background: "var(--surf)", borderTop: "1px solid var(--line)" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-5 pt-14 sm:pt-20">
        <div
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-10 pb-10"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div className="max-w-sm">
            <p className="font-black text-lg mb-2" style={{ color: "var(--tx)" }}>
              Rifat Syahman
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Software Developer from Jakarta — building web, mobile, and data
              products with genuine care.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div>
              <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>
                Navigate
              </p>
              <div className="flex flex-col gap-2.5">
                {navLinks.map((link) => (
                  <a key={link.href} href={`${basePath}/${link.href}`} className="nav-link text-sm w-fit">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>
                Connect
              </p>
              <div className="flex gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={label !== "Email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="soc"
                    aria-label={label}
                    data-magnetic=""
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <p>&copy; 2025 Mochamad Rifat Syahman Hambali. All rights reserved.</p>
          <p>Designed &amp; built from scratch.</p>
        </div>
      </div>
    </footer>
  );
}
