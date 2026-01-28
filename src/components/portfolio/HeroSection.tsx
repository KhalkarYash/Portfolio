import { motion, Variants } from "framer-motion";
import { ArrowDown, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
      <div className="md:flex md:items-center md:justify-between">
        <motion.div
          variants={itemVariants}
          className="mt-8 w-full md:mt-0 flex items-end flex-row gap-4 justify-between flex-wrap"
        >
          <div className="mt-4 text-center">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl text-red-600 font-black leading-[1.1] tracking-tight mb-6 text-balance"
            >
              Yash Khalkar
            </motion.h1>
          </div>
          <Avatar className="h-56 w-56">
            <img className="glow" src="/yash-cropped.png" alt="Yash Khalkar" />
            <AvatarFallback>YK</AvatarFallback>
          </Avatar>
        </motion.div>
      </div>

      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-balance"
      >
        Full-stack developer building{" "}
        <span className="gradient-text">impactful</span> web applications
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
      >
        Specializing in MERN stack and Next.js with proven experience in cloud
        deployment and leading tech communities. Former GDG On Campus Lead @
        MET, Hacktoberfest Nashik '24 Co-organizer. Currently based in Nashik,
        India.
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
          href="https://1drv.ms/f/c/c4ef5729b36ead51/Eso0Nur2bClDs1i99koJ_lcBocyPOGCuRdH-W-Lb-rrlRQ"
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
