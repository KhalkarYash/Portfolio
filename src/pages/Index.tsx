import { useEffect } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { WorkProjectsSection } from "@/components/portfolio/WorkProjectsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { BlogsSection } from "@/components/portfolio/BlogsSection";
import { TechStackSection } from "@/components/portfolio/TechStackSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";
import { DockMenu } from "@/components/portfolio/DockMenu";
import { EducationSection } from "@/components/portfolio/EducationSection";

const Index = () => {
  // Set dark mode by default on first load
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (!stored) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add(stored);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground page-load">
      {/* Gradient background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[60px]" />
      </div>

      <Navbar />

      <main className="relative max-w-2xl mx-auto px-6 pt-24 pb-32">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <WorkProjectsSection />
        <ProjectsSection />
        <BlogsSection />
        <TechStackSection />
        <EducationSection />
        <ContactSection />
        <Footer />
      </main>

      <DockMenu />
    </div>
  );
};

export default Index;
