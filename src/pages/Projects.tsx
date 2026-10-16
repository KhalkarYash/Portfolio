import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { CollectionPageLayout } from "@/components/portfolio/CollectionPageLayout";
import { useProjectsQuery } from "@/features/portfolio/queries";

const Projects = () => {
  const { data: projects = [], isPending, error } = useProjectsQuery();

  return (
    <CollectionPageLayout
      title="All Projects"
      description="A collection of personal projects I've built and contributed to."
      state={isPending ? "loading" : error ? "error" : "ready"}
      errorMessage="Unable to load projects right now. Please try again later."
    >
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </CollectionPageLayout>
  );
};

export default Projects;
