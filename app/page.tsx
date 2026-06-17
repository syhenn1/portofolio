import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroLanyard from "@/components/HeroLanyard";
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
      <ScrollProgress />
      <Navbar />
      <main>
        <div className="relative">
          <Hero />
          <HeroLanyard />
        </div>
        <Stats />
        <Projects />
        <div className="divline" />
        <About />
        <div className="divline" />
        <Skills />
        <div className="divline" />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
