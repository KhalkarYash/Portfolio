import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { experiences } from "@/utils/constants";

export function ExperienceSection() {
  return (
    <section className="py-12">
      <SectionHeader number="02" title="Experience" />

      <div className="relative pl-8 border-l-2 border-border space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline dot */}
            <motion.div
              className={`absolute -left-[25px] top-1.5 w-4 h-4 rounded-full border-4 border-background ${
                exp.current ? "bg-primary glow" : "bg-muted-foreground"
              }`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            />

            <div className="space-y-2">
              <span
                className={`text-xs font-bold font-mono uppercase tracking-wider ${
                  exp.current ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {exp.year}
              </span>
              <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
              <p className="text-sm text-surface-foreground font-medium">
                {exp.company} • {exp.location}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
