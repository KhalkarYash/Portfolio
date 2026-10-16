import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { CollectionPageLayout } from "@/components/portfolio/CollectionPageLayout";
import { useWorkProjectsQuery } from "@/features/portfolio/queries";

const WorkProjects = () => {
  const { data: workProjects = [], isPending, error } = useWorkProjectsQuery();

  return (
    <CollectionPageLayout
      title="All Work Projects"
      description="Professional projects I've worked on during internships and collaborations."
      state={isPending ? "loading" : error ? "error" : "ready"}
      errorMessage="Unable to load work projects right now. Please try again later."
    >
      <div className="grid grid-cols-1 gap-6">
        {workProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </CollectionPageLayout>
  );
};

export default WorkProjects;
