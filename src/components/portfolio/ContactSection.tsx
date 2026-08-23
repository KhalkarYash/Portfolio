import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const contactLinks = [
  {
    icon: Mail,
    href: "mailto:yashmk2004@gmail.com",
    label: "Email",
    description: "Best for direct opportunities and collaboration.",
  },
  {
    icon: Linkedin,
    href: "https://in.linkedin.com/in/yashkhalkar",
    label: "LinkedIn",
    description: "Best for professional networking and role discussions.",
  },
  {
    icon: Github,
    href: "https://github.com/khalkaryash",
    label: "GitHub",
    description: "Browse projects, code, and open-source work.",
  },
];

export function ContactSection() {

  return (
    <section id="contact" className="py-12">
      <SectionHeader number="07" title="Get In Touch" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="liquid-glass p-6 md:p-8 rounded-2xl"
      >
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Best way to reach me is via LinkedIn or email. I usually respond
          within 24 hours.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto")
                  ? undefined
                  : "noopener noreferrer"
              }
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-border bg-background/40 p-4 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <link.icon className="w-4 h-4 text-primary" />
                {link.label}
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {link.description}
              </p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
