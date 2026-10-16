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
    year: "2020 — 2023",
    college: "Government Polytechnic, Nashik",
    location: "Nashik",
    current: false,
    degree: "Diploma in Computer Technology",
  },
];

export function EducationSection() {
  return (
    <section className="py-12">
      <SectionHeader number="07" title="Education" />

      <div className="education-list">
        {educations.map((education, index) => (
          <motion.article
            key={education.degree}
            className="education-item"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="education-year">{education.year}</span>
            <div>
              <h3 className="education-degree">{education.degree}</h3>
              <p className="education-school">{education.college} <span aria-hidden="true">/</span> {education.location}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
