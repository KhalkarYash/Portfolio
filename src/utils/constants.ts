import { type Experience } from "@/utils/types";

export const projectsJSON: string =
  "https://gist.githubusercontent.com/KhalkarYash/8f51f549f3e49a75fd14a5e42ecf727c/raw/129ef35ba772f448bfeaa98b2ecf5dabe1ee60fc/projects.json";

export const blogsJSON: string =
  "https://gist.githubusercontent.com/KhalkarYash/6fa109c2d60f23151ee5ce0b347eff27/raw/55f681407cfeb45a70e235ce92c8d80f184c3892/blogs.json";

export const experiences: Experience[] = [
  {
    year: "2026 — PRESENT",
    role: "SWE (Backend Engineer)",
    company: "Skillminds LLP",
    location: "Nashik",
    description:
      "Contributing to the development of an in-house product 'Pheraas', owning backend architecture, REST APIs, data modeling, authentication, and core product workflows. Working closely on feature delivery, implementation details, and production-ready behavior across the main backend surface area.",
    current: true,
  },
  {
    year: "2025",
    role: "Frontend Intern",
    company: "Zenzop",
    location: "Remote",
    description:
      "Built and launched the Admin Panel and company Landing Page with Onboarding flow. Developed key back-end routes to enable seamless product functionality. Contributed as a founding developer, collaborating closely with the core team.",
    current: false,
  },
  {
    year: "2024",
    role: "AI Intern",
    company: "Infosys Springboard Internship 5.0",
    location: "Remote",
    description:
      "Completed a structured internship focused on practical machine learning applications in healthcare. Worked in a project-based learning environment replicating industry-level workflows and collaboration.",
    current: false,
  },
];
