import { Navbar } from "@/components/portfolio/Navbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { BeyondWorkSection } from "@/components/portfolio/BeyondWorkSection";
import { WorkProjectsSection } from "@/components/portfolio/WorkProjectsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { BlogsSection } from "@/components/portfolio/BlogsSection";
import { TechStackSection } from "@/components/portfolio/TechStackSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";
import { EducationSection } from "@/components/portfolio/EducationSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="relative pb-12 md:pb-16">
        <HeroSection />
        <div className="portfolio-content mx-auto max-w-[1120px] px-6 sm:px-10 lg:px-16">
          <AboutSection />
          <ExperienceSection />
          <WorkProjectsSection />
          <ProjectsSection />
          <BlogsSection />
          <TechStackSection />
          <EducationSection />
          <BeyondWorkSection />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Index;
