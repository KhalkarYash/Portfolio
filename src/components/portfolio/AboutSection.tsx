import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

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
          Full-stack JavaScript developer focused on building practical web
          applications from user-facing interfaces to backend flows and
          deployment.
        </p>
        <p>
          My experience spans work on an in-house product at Skillminds, admin
          and onboarding flows at Zenzop, and machine-learning project work at
          Infosys Springboard. I like working across features, logic, and
          delivery so the product feels complete end to end.
        </p>
        <p>
          As a former Tech Community Leader (GDG On Campus Lead @ MET), I've led
          12+ events and co-organized Hacktoberfest Nashik '24, drawing 600+
          registrations and 300+ active contributors.
        </p>
      </motion.div>
    </section>
  );
}
