import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { experiences } from "@/utils/constants";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-12">
      <SectionHeader number="02" title="Experience" />

      <div className="experience-list">
        {experiences.map((experience, index) => (
          <motion.article
            key={`${experience.company}-${experience.year}`}
            className="experience-item"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="experience-meta">
              <span className="experience-year">{experience.year}</span>
              {experience.current && <span className="experience-current">CURRENT</span>}
            </div>
            <div>
              <h3 className="experience-role">{experience.role}</h3>
              <p className="experience-company">{experience.company} <span aria-hidden="true">/</span> {experience.location}</p>
              <p className="experience-description">{experience.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
