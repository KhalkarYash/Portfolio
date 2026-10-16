import { motion } from "framer-motion";
import { BlogCard } from "@/components/portfolio/BlogCard";
import { CollectionPageLayout } from "@/components/portfolio/CollectionPageLayout";
import { useBlogsQuery } from "@/features/portfolio/queries";

const Blogs = () => {
  const { data: blogs = [], isPending, error } = useBlogsQuery();

  return (
    <CollectionPageLayout
      title="All Blogs"
      description="Thoughts on engineering, systems, and the craft of building software."
      state={isPending ? "loading" : error ? "error" : "ready"}
      errorMessage="Unable to load blogs right now. Please try again later."
      footer={(
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
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            View more articles on Medium
            <span className="text-primary" aria-hidden="true">→</span>
          </a>
        </motion.div>
      )}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.title} blog={blog} index={index} />
        ))}
      </div>
    </CollectionPageLayout>
  );
};

export default Blogs;
