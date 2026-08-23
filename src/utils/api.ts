import { type Project, type Blog } from "@/utils/types";
import { projectsJSON, blogsJSON } from "./constants";

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(projectsJSON);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = await response.json();
  return data.projects.filter((project: Project) => project.enabled);
}

export async function fetchWorkProjects(): Promise<Project[]> {
  const response = await fetch(projectsJSON);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = await response.json();
  return data.workProjects.filter((project: Project) => project.enabled);
}

export async function fetchBlogs(): Promise<Blog[]> {
  const response = await fetch(blogsJSON);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = await response.json();
  return data.blogs.filter((blog: Blog) => blog.enabled);
}
