import { type Project, type Blog } from "@/utils/types";
import { mediumRssJSON, projectsJSON } from "./constants";

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
  const response = await fetch(mediumRssJSON);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = (await response.json()) as MediumFeedResponse;
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
