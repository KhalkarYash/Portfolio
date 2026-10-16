import { useProjectsQuery } from "@/features/portfolio/queries";
import { HorizontalProjectSection } from "./HorizontalProjectSection";

export function ProjectsSection() {
  const { data: projects = [], error } = useProjectsQuery();

  return (
    <HorizontalProjectSection
      id="projects"
      number="04.2"
      title="Projects"
      projects={projects}
      error={error}
      moreHref="/projects"
      moreLabel="All projects"
      moreWhen={3}
    />
  );
}
