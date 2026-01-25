import { motion, Variants } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

const techStack = [
  { category: "Frontend", items: "React, Next.js, React Native" },
  { category: "Backend", items: "Node.js, Express, Hono" },
  { category: "Databases", items: "MongoDB, PostgreSQL, MySQL" },
  { category: "Cloud", items: "AWS, Vercel, Cloudflare" },
  { category: "Languages", items: "TypeScript, Python, Java" },
  { category: "Tools", items: "Git, Docker, Postman" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export function TechStackSection() {
  return (
    <section className="py-12 border-t border-border">
      <SectionHeader number="05" title="Tech Stack" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        {techStack.map((tech, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="liquid-glass p-4 rounded-xl text-center hover-lift group"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              {tech.category}
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {tech.items}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
