import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogCard } from "@/components/portfolio/BlogCard";
import { type Blog } from "@/utils/types";
import { fetchBlogs } from "@/utils/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      document.documentElement.classList.add(stored);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    fetchBlogs()
      .then(setBlogs)
      .catch((error) => console.error("Error fetching blogs:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Gradient background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[60px]" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-24 pb-32">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">All Blogs</h1>
          <p className="text-muted-foreground text-sm">
            Thoughts on engineering, systems, and the craft of building
            software.
          </p>
        </motion.div>

        {/* Blogs grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.title} blog={blog} index={index} />
            ))}
          </div>
        )}

        {/* Medium link */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <a
            href="https://medium.com/@yashmk2004"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            View more articles on Medium
            <span className="text-primary">→</span>
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default Blogs;
