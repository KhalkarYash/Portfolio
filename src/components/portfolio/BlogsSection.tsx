import { SectionHeader } from "./SectionHeader";
import { BlogCard } from "./BlogCard";

const blogs = [
  {
    title: "Watching a System Instead of Fixing It",
    description:
      "Debugging used to feel like fixing. Something breaks, you find the line, you change the code, you move on. That...",
    image:
      "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*816a8z1LqEQe3__ACoRaSg.png",
    link: "https://medium.com/@yashmk2004/watching-a-system-instead-of-fixing-it-c77c872cada0",
    date: "Jan 25, 2026",
    readTime: "2 min read",
  },
  {
    title: "What a 130-Page Requirements Document Revealed About Engineering",
    description:
      "I used to think engineering work began when the editor opened. That once the prob...",
    image:
      "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*urzUEKMbdEL8K0CdvBLtpg.png",
    link: "https://medium.com/@yashmk2004/what-a-130-page-requirements-document-revealed-about-engineering-e839c5590716",
    date: "Jan 19 ,2026",
    readTime: "2 min read",
  },
  {
    title: "Building systems vs understanding them",
    description:
      "I used to think I understood backend systems because I could build them. I could set up an API, conn...",
    image:
      "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*07HNzgOY00B-NcgS8J2OCw.png",
    link: "https://medium.com/@yashmk2004/building-systems-vs-understanding-them-5dafe17868ce",
    date: "Jan 7, 2026",
    readTime: "2 min read",
  },
];

export function BlogsSection() {
  return (
    <section id="blogs" className="py-12">
      <SectionHeader number="04" title="Latest Blogs" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.title} blog={blog} index={index} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="https://medium.com/@yashmk2004"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View all articles on Medium
          <span className="text-primary">→</span>
        </a>
      </div>
    </section>
  );
}
