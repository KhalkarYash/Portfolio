export const config = {
  runtime: "edge"
};

const profile = {
  name: "Yash Khalkar",
  role: "Backend-focused full-stack software engineer",
  location: "Nashik, India",
  summary: "Software engineer building web applications, mobile applications, REST APIs, database-backed systems, and practical software products from interface to deployment.",
  skills: ["TypeScript", "React", "Node.js", "REST APIs", "PostgreSQL", "MongoDB", "AWS", "Docker"],
  links: {
    home: "https://yashkhalkar.vercel.app/",
    projects: "https://yashkhalkar.vercel.app/projects",
    contact: "https://yashkhalkar.vercel.app/contact",
    developers: "https://yashkhalkar.vercel.app/developers"
  }
};

const apiHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=300, must-revalidate",
  "RateLimit-Limit": "60",
  "RateLimit-Remaining": "59",
  "RateLimit-Reset": "60",
  "Deprecation": "false",
  "Access-Control-Allow-Origin": "*"
};

const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { ...apiHeaders, ...extraHeaders } });

const error = (status: number, code: string, message: string, hint: string) =>
  json({ error: { code, message, hint } }, status, status === 429 ? { "Retry-After": "60" } : {});

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...apiHeaders,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Accept, Content-Type"
      }
    });
  }

  if (request.method !== "GET") {
    return error(405, "METHOD_NOT_ALLOWED", "This profile endpoint only accepts GET requests.", "Use GET /api/v1/profile to retrieve the public profile.");
  }

  return json({ data: profile, meta: { apiVersion: "v1", updated: "2026-09-09" } });
}
