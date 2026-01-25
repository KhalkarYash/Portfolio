import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { workProjects } from "../../utils/constants";

export function WorkProjectsSection() {
  return (
    <section id="projects" className="py-12">
      <SectionHeader number="03" title="Work Projects" />

      <div className="grid grid-cols-1 gap-6">
        {workProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
