import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroLanyard from "@/components/HeroLanyard";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import About from "@/components/About";
import JourneyTimeline from "@/components/JourneyTimeline";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileSwipeDots from "@/components/MobileSwipeDots";
import IntroGate from "@/components/IntroGate";

export default function Home() {
  return (
    <IntroGate>
      <Navbar />
      <MobileSwipeDots />
      <main>
        <div className="relative">
          <Hero />
          <HeroLanyard />
        </div>
        <About />
        <div className="divline relative z-2" />
        <Stats />
        <JourneyTimeline />
        <Projects />
        <div className="divline relative z-2" />
        <Skills />
        <div className="divline relative z-2" />
        <Contact />
      </main>
      <Footer />
    </IntroGate>
  );
}
