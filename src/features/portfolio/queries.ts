import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  fetchBlogs,
  fetchProjects,
  fetchWorkProjects,
} from "./api";

const portfolioQueryDefaults = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const portfolioQueryKeys = {
  projects: ["portfolio", "projects"] as const,
  workProjects: ["portfolio", "work-projects"] as const,
  blogs: ["portfolio", "blogs"] as const,
};

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: portfolioQueryKeys.projects,
    queryFn: ({ signal }) => fetchProjects(signal),
    ...portfolioQueryDefaults,
  });

export const workProjectsQueryOptions = () =>
  queryOptions({
    queryKey: portfolioQueryKeys.workProjects,
    queryFn: ({ signal }) => fetchWorkProjects(signal),
    ...portfolioQueryDefaults,
  });

export const blogsQueryOptions = () =>
  queryOptions({
    queryKey: portfolioQueryKeys.blogs,
    queryFn: ({ signal }) => fetchBlogs(signal),
    ...portfolioQueryDefaults,
  });

export const useProjectsQuery = () => useQuery(projectsQueryOptions());

export const useWorkProjectsQuery = () => useQuery(workProjectsQueryOptions());

export const useBlogsQuery = () => useQuery(blogsQueryOptions());
