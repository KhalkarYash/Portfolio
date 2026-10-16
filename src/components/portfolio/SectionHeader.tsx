import { motion } from "framer-motion";
import { type SectionHeaderProps } from "@/utils/types";

export function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <motion.div
      className="section-heading mb-10 flex items-end justify-between gap-6 md:mb-14"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="section-index">{number}</span>
        <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">{title}</h2>
      </div>
      <div className="mb-2 hidden h-px flex-1 bg-border md:block" />
    </motion.div>
  );
}
