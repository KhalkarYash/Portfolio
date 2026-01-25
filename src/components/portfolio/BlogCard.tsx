import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';

interface Blog {
  title: string;
  description: string;
  image?: string;
  link: string;
  date: string;
  readTime?: string;
}

interface BlogCardProps {
  blog: Blog;
  index: number;
}

const defaultBlogImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=340&fit=crop";

export function BlogCard({ blog, index }: BlogCardProps) {
  return (
    <motion.a
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
      }}
      className="group block liquid-glass rounded-2xl overflow-hidden hover-lift cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.img
          src={blog.image || defaultBlogImage}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultBlogImage;
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        
        {/* External link indicator */}
        <div className="absolute top-3 right-3 p-2 rounded-lg liquid-glass opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {blog.date}
          </span>
          {blog.readTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{blog.readTime}</span>
            </>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {blog.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {blog.description}
        </p>
        
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Read on Medium
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.a>
  );
}
