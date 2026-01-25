import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

export function AboutSection() {
  return (
    <section className="py-12 border-t border-border">
      <SectionHeader number="01" title="About" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4 text-muted-foreground leading-relaxed"
      >
        <p>
          Full-stack JavaScript developer with a strong foundation in building impactful 
          web applications using MERN and Next.js. I have proven experience organizing 
          large-scale developer initiatives and deploying production-ready projects using 
          cloud platforms like AWS, Netlify, Vercel, Render, and Cloudflare Workers.
        </p>
        <p>
          As a former Tech Community Leader (GDG On Campus Lead @ MET), I've led 12+ events 
          and co-organized Hacktoberfest Nashik '24, drawing 600+ registrations and 300+ 
          active contributors. I believe in building scalable systems that solve real-world 
          problems while fostering collaborative developer communities.
        </p>
      </motion.div>
    </section>
  );
}
