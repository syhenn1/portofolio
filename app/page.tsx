import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import About from "@/components/About";
import JourneyTimeline from "@/components/JourneyTimeline";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileSwipeDots from "@/components/MobileSwipeDots";
import LiquidBubbles from "@/components/LiquidBubbles";

export default function Home() {
  return (
    <>
      <Navbar />
      <MobileSwipeDots />
      <main>
        <Hero />
        <div className="relative">
          <LiquidBubbles />
          <About />
          <Stats />
        </div>
        <JourneyTimeline />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
