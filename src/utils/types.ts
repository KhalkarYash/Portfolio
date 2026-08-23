// ──────────────────────────────────────────────
// Central type definitions for the portfolio app
// ──────────────────────────────────────────────

export interface Project {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link?: string;
  github?: string;
}

export interface ProjectCardProps {
  project: Project;
  index: number;
}

export interface Blog {
  enabled: boolean;
  title: string;
  description: string;
  image?: string;
  link: string;
  date: string;
  readTime?: string;
}

export interface BlogCardProps {
  blog: Blog;
  index: number;
}

export interface Experience {
  year: string;
  role: string;
  company: string;
  location: string;
  description: string;
  current: boolean;
}

export interface SectionHeaderProps {
  number: string;
  title: string;
}
