import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const educations = [
  {
    year: "2023 — 2026",
    college: "Savitribai Phule Pune University",
    location: "Nashik",
    current: true,
    degree: "B.Tech in Computer Engineering",
  },
  {
    year: "2020 - 2023",
    college: "Government Polytechnic, Nashik",
    location: "Nashik",
    current: false,
    degree: "Diploma in Computer Technology",
  },
];

export function EducationSection() {
  return (
    <section className="py-12">
      <SectionHeader number="06" title="Education" />

      <div className="relative pl-8 border-l-2 border-border space-y-12">
        {educations.map((edu, index) => (
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
                edu.current ? "bg-primary glow" : "bg-muted-foreground"
              }`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            />

            <div className="space-y-2">
              <span
                className={`text-xs font-bold font-mono uppercase tracking-wider ${
                  edu.current ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {edu.year}
              </span>
              <h3 className="text-lg font-bold text-foreground">
                {edu.degree}
              </h3>
              <p className="text-sm text-surface-foreground font-medium">
                {edu.college} • {edu.location}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
