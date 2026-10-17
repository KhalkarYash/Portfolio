import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Index = lazy(() => import("@/pages/Index"));
const Projects = lazy(() => import("@/pages/Projects"));
const WorkProjects = lazy(() => import("@/pages/WorkProjects"));
const Blogs = lazy(() => import("@/pages/Blogs"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const DesignDirections = lazy(() => import("@/pages/DesignDirections"));

export function AppRoutes() {
  return (
    <Suspense
      fallback={(
        <div
          className="flex min-h-screen items-center justify-center bg-background text-muted-foreground"
          role="status"
          aria-label="Loading page"
        >
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
        </div>
      )}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/work-projects" element={<WorkProjects />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/design-directions" element={<DesignDirections />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
