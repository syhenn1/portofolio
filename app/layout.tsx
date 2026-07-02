import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import WaveBackground from "@/components/WaveBackground";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Rifat Syahman — Software Developer",
  description:
    "Portfolio Rifat Syahman, Software Developer dari Jakarta. Web, mobile, dan data — dibangun dengan Next.js, Tailwind CSS, dan Framer Motion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} scroll-smooth`}>
      <body style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        {/* Fixed-position elements live outside PageTransition to avoid being
            trapped inside the motion.div containing block (CSS transform caveat) */}
        <WaveBackground />
        <ScrollProgress />
        <BackToTop />
        <SmoothScrollProvider>
          <PageTransition>{children}</PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
