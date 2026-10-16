import { motion } from "framer-motion";
import { type SectionHeaderProps } from "@/features/portfolio/types";

export function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <motion.div
      className="section-heading mb-10 flex items-end justify-between gap-6 md:mb-14"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <span className="section-index">{number}</span>
        <h2 className="section-title font-serif text-foreground">{title}</h2>
      </div>
    </motion.div>
  );
}
