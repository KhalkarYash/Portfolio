import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { useProjectsQuery } from "@/hooks/usePortfolioQueries";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";

const Projects = () => {
  const { data: projects = [], isPending, error } = useProjectsQuery();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="relative mx-auto max-w-[1120px] px-6 pb-24 pt-8 sm:px-10 lg:px-16">
        <div className="mb-16 flex items-center justify-between border-b border-border pb-5">
          <Link to="/" className="site-mark" aria-label="Yash Khalkar, home">YK<span>.</span></Link>
          <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="mb-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            All Projects
          </h1>
          <p className="text-muted-foreground text-sm">
            A collection of personal projects I've built and contributed to.
          </p>
        </motion.div>

        {/* Projects grid */}
        {isPending ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Unable to load projects right now. Please try again later.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
