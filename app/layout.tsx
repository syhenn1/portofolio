import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { MagneticCursor } from "@/components/MagneticCursor";
import DisableCopy from "@/components/DisableCopy";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "rifatSyahman",
  description:
    "Portfolio of Rifat Syahman, Software Developer from Jakarta. Web, mobile, and data — built with Next.js, Tailwind CSS, and Framer Motion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} scroll-smooth`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='amd'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();",
          }}
        />
        <DisableCopy />
        <MagneticCursor cursorSize={22} magneticFactor={0.35} lerpAmount={0.55}>
          {/* Fixed-position elements live outside PageTransition to avoid being
              trapped inside the motion.div containing block (CSS transform caveat) */}
          <ScrollProgress />
          <BackToTop />
          <SmoothScrollProvider>
            <PageTransition>{children}</PageTransition>
          </SmoothScrollProvider>
        </MagneticCursor>
      </body>
    </html>
  );
}
