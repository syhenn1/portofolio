import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroLanyard from "@/components/HeroLanyard";
import WaveBackground from "@/components/WaveBackground";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <WaveBackground />
      <ScrollProgress />
      <Navbar />
      <main>
        <div className="relative">
          <Hero />
          <HeroLanyard />
        </div>
        <Stats />
        <Projects />
        <div className="divline relative z-2" />
        <About />
        <div className="divline relative z-2" />
        <Skills />
        <div className="divline relative z-2" />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
