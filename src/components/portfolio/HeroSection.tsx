import { motion, Variants } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function HeroSection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-16 md:py-24"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-balance"
      >
        Full-stack developer building{' '}
        <span className="gradient-text">impactful</span>{' '}
        web applications
      </motion.h1>
      
      <motion.p
        variants={itemVariants}
        className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
      >
        Specializing in MERN stack and Next.js with proven experience in cloud deployment 
        and leading tech communities. Former GDG On Campus Lead @ MET, Hacktoberfest Nashik 
        '24 Co-organizer. Currently based in Nashik, India.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
        <motion.a
          href="#projects"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover-lift glow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Projects
          <ArrowDown className="w-4 h-4" />
        </motion.a>
        <motion.a
          href="https://onedrive.live.com/embed?resid=YOUR_RESUME_ID"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 glass font-semibold py-3 px-6 rounded-xl hover:bg-primary/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="w-4 h-4" />
          View Resume
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
