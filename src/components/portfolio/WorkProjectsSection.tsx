import { useWorkProjectsQuery } from "@/hooks/usePortfolioQueries";
import { HorizontalProjectSection } from "./HorizontalProjectSection";

export function WorkProjectsSection() {
  const { data: workProjects = [], error } = useWorkProjectsQuery();

  return (
    <HorizontalProjectSection
      id="work-projects"
      number="03.1"
      title="Work Projects"
      projects={workProjects}
      error={error}
      moreHref="/work-projects"
      moreLabel="All work projects"
      moreWhen={2}
    />
  );
}
