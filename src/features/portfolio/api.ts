import { type Project, type Blog } from "./types";
import { portfolioEndpoints } from "./config";

interface MediumFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  enclosure?: { link?: string };
}

interface MediumFeedResponse {
  status: string;
  items: MediumFeedItem[];
}

interface ProjectsResponse {
  projects: Project[];
  workProjects: Project[];
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  return response.json() as Promise<T>;
}

async function fetchProjectCollection(
  collection: keyof ProjectsResponse,
  signal?: AbortSignal,
): Promise<Project[]> {
  const data = await fetchJson<ProjectsResponse>(portfolioEndpoints.projects, signal);
  return data[collection].filter((project) => project.enabled);
}

export const fetchProjects = (signal?: AbortSignal) =>
  fetchProjectCollection("projects", signal);

export const fetchWorkProjects = (signal?: AbortSignal) =>
  fetchProjectCollection("workProjects", signal);

export async function fetchBlogs(signal?: AbortSignal): Promise<Blog[]> {
  const data = await fetchJson<MediumFeedResponse>(portfolioEndpoints.blogs, signal);
  if (data.status !== "ok") throw new Error("Medium RSS feed returned an error");

  return data.items.map((item) => {
    const article = new DOMParser().parseFromString(item.description, "text/html");
    const description = article.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const articleImage = article.querySelector("img")?.getAttribute("src")
      || article.querySelector("img")?.getAttribute("data-src");

    return {
      enabled: true,
      title: item.title,
      description,
      image: item.thumbnail || item.enclosure?.link || articleImage,
      link: item.link,
      date: new Date(item.pubDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  });
}
