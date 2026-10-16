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
      <SectionHeader number="09" title="Get In Touch" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="contact-content"
      >
        <p className="contact-prompt mb-12 max-w-3xl font-serif leading-[1.25] text-foreground">
          Have a good problem to solve? I’d be glad to hear about it.
        </p>

        <div className="grid border-t border-border sm:grid-cols-3">
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
              className="contact-link border-b border-border py-5 transition-colors sm:mr-8"
            >
              <div className="flex items-center justify-between text-foreground font-medium">
                <span className="flex items-center gap-3">
                <link.icon className="w-4 h-4 text-primary" />
                {link.label}
                </span>
                <span aria-hidden="true" className="text-primary">↗</span>
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
