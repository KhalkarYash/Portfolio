import { describe, it, expect } from "vitest";
import { vi } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fetchBlogs } from "@/utils/api";

const workspaceFile = (file: string) => resolve(process.cwd(), file);

describe("agent readiness resources", () => {
  it("provides meaningful homepage content without JavaScript", async () => {
    const html = await readFile(workspaceFile("index.html"), "utf8");
    const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";

    expect(fallback.replace(/<[^>]+>/g, " ").trim().length).toBeGreaterThan(500);
    expect(fallback).toContain("<h1>");
    expect(fallback).toContain("<h2>");
    expect(fallback).toContain("/llms.txt");
  });

  it("publishes trust pages and a markdown-aware Vercel route", async () => {
    const vercel = await readFile(workspaceFile("vercel.json"), "utf8");
    expect(vercel).toContain("text/markdown");
    expect(vercel).toContain("Accept, Accept-Encoding");

    for (const page of ["about", "contact", "privacy"]) {
      const html = await readFile(workspaceFile(`public/${page}/index.html`), "utf8");
      expect(html).toMatch(new RegExp(`<h1>[^<]+</h1>`));
      expect(html.replace(/<[^>]+>/g, " ").trim().length).toBeGreaterThan(500);
    }
  });

  it("provides recovery links in the real 404 document", async () => {
    const notFound = await readFile(workspaceFile("public/404.html"), "utf8");
    expect(notFound).toContain("# Page not found");
    expect(notFound).toContain("/sitemap.xml");
    expect(notFound).toContain("/llms.txt");
  });

  it("maps Medium RSS items to the existing blog card shape", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [{
          title: "Building reliable APIs",
          description: "<p>A <strong>short</strong> engineering note.</p>",
          link: "https://medium.com/@yashmk2004/building-reliable-apis",
          pubDate: "2026-08-23 10:56:23",
          thumbnail: "https://example.com/image.jpg",
        }],
      }),
    }));

    await expect(fetchBlogs()).resolves.toEqual([{
      enabled: true,
      title: "Building reliable APIs",
      description: "A short engineering note.",
      image: "https://example.com/image.jpg",
      link: "https://medium.com/@yashmk2004/building-reliable-apis",
      date: "Aug 23, 2026",
    }]);

    vi.unstubAllGlobals();
  });

  it("uses the first image embedded in a Medium article when no thumbnail exists", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "ok",
        items: [{
          title: "An article with a cover image",
          description: '<figure><img alt="Cover" src="https://miro.medium.com/cover.jpg"></figure><p>Article text.</p>',
          link: "https://medium.com/@yashmk2004/article-with-cover",
          pubDate: "2026-08-23 10:56:23",
          thumbnail: "",
        }],
      }),
    }));

    await expect(fetchBlogs()).resolves.toEqual([expect.objectContaining({
      image: "https://miro.medium.com/cover.jpg",
    })]);

    vi.unstubAllGlobals();
  });
});
