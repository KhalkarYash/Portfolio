import { motion } from 'framer-motion';

interface SectionHeaderProps {
  number: string;
  title: string;
}

export function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <motion.div 
      className="flex items-center gap-3 mb-8"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-primary text-sm font-mono font-semibold">{number}</span>
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      <div className="flex-1 h-px bg-border" />
    </motion.div>
  );
}
