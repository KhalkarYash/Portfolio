import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { projects } from "../../utils/constants";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-12">
      <SectionHeader number="03" title="Selected Works" />

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
