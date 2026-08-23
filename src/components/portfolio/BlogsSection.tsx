import { SectionHeader } from "./SectionHeader";
import { BlogCard } from "./BlogCard";
import { type Blog } from "@/utils/types";
import { fetchBlogs } from "../../utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs()
      .then(setBlogs)
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <section id="blogs" className="py-12">
      <SectionHeader number="04" title="Latest Blogs" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {blogs.slice(0, 2).map((blog, index) => (
          <BlogCard key={blog.title} blog={blog} index={index} />
        ))}
      </div>

      {blogs.length > 2 && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            View All Blogs
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
