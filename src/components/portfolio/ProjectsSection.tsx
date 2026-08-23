"use client";

import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { type Project } from "@/utils/types";
import { fetchProjects } from "../../utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <section id="projects" className="py-12">
      <SectionHeader number="03.2" title="Projects" />

      <div className="grid grid-cols-1 gap-6">
        {projects.slice(0, 3).map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      {projects.length > 3 && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
