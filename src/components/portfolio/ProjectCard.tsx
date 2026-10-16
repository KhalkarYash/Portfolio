import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { type ProjectCardProps } from "@/utils/types";

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08 }}
      className="project-entry group grid gap-7 border-b border-border py-8 first:pt-0 last:border-0 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-12 md:py-12"
    >
      <a
        href={project.link || project.github || "#projects"}
        target={project.link || project.github ? "_blank" : undefined}
        rel={project.link || project.github ? "noopener noreferrer" : undefined}
        className="project-image-link block overflow-hidden bg-card/60"
        aria-label={`Open ${project.title}`}
      >
        <div className="relative aspect-[1.6/1] overflow-hidden">
          <motion.img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
          <div className="project-image-wash absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
        </div>
      </a>

      <div className="project-copy">
        <div className="mb-4 flex items-start justify-between gap-5">
          <h3 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">{project.title}</h3>
          <div className="flex shrink-0 gap-3 pt-2">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-icon-link" aria-label={`View ${project.title} live`}>
                <ExternalLink className="h-[18px] w-[18px]" />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-icon-link" aria-label={`View ${project.title} source code`}>
                <Github className="h-[18px] w-[18px]" />
              </a>
            )}
          </div>
        </div>
        <p className="max-w-lg text-[15px] leading-7 text-muted-foreground">{project.description}</p>
        <p className="project-tools mt-6">{project.tech.join("  ·  ")}</p>
      </div>
    </motion.article>
  );
}
