import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type BlogCardProps } from "@/utils/types";

const defaultBlogImage = "/mediumHono.jpg";

export function BlogCard({ blog, index }: BlogCardProps) {
  return (
    <motion.a
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group block text-inherit no-underline"
    >
      <div className="relative mb-5 aspect-[1.7/1] overflow-hidden bg-card">
        <img
          src={blog.image || defaultBlogImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          onError={(event) => { (event.target as HTMLImageElement).src = defaultBlogImage; }}
        />
        <div className="project-image-wash absolute inset-0" />
      </div>
      <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{blog.date}{blog.readTime ? ` · ${blog.readTime}` : ""}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <h3 className="blog-title mb-2 font-serif tracking-tight text-foreground transition-colors group-hover:text-primary">{blog.title}</h3>
      <p className="blog-description line-clamp-2 text-muted-foreground">{blog.description}</p>
    </motion.a>
  );
}
