import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const techStack = [
  { category: "Interface", items: "React, Next.js, React Native" },
  { category: "Systems", items: "Node.js, Express, Hono" },
  { category: "Data", items: "MongoDB, PostgreSQL, MySQL" },
  { category: "Infrastructure", items: "AWS, Vercel, Cloudflare" },
  { category: "Languages", items: "TypeScript, Python, Java" },
  { category: "Workflow", items: "Git, Docker, Postman" },
];

export function TechStackSection() {
  return (
    <section className="py-12">
      <SectionHeader number="06" title="Tools I work with" />
      <div className="grid gap-x-12 sm:grid-cols-2">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.category}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            className="tech-row flex min-h-20 items-center justify-between gap-4 border-b border-border py-5"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{tech.category}</p>
            <p className="text-right text-sm text-foreground">{tech.items}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
