import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Architecture from "@/components/Architecture";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Roadmap from "@/components/Roadmap";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Architecture />
        <Projects />
        <Experience />
        <Roadmap />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
