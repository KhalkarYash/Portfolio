import { motion } from "framer-motion";
import { Github, Globe, Mail, Linkedin, XIcon, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Mail, href: "mailto:yashmk2004@gmail.com", label: "Email" },
  { icon: Github, href: "https://github.com/khalkaryash", label: "GitHub" },
  { icon: Globe, href: "https://yashkhalkar.vercel.app", label: "Website" },
  {
    icon: Linkedin,
    href: "https://in.linkedin.com/in/yashkhalkar",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/yashkhalkar001",
    label: "Insta",
  },
  { icon: XIcon, href: "https://www.x.com/yashkhalkar001", label: "Close" },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 border-t border-border text-center"
    >
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em] mb-6">
        Built with precision • 2026 © Yash Khalkar
      </p>

      <div className="flex justify-center gap-4">
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.href}
            target={social.href.startsWith("mailto") ? undefined : "_blank"}
            rel={
              social.href.startsWith("mailto")
                ? undefined
                : "noopener noreferrer"
            }
            className="p-3 rounded-xl glass hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={social.label}
          >
            <social.icon className="w-5 h-5" />
          </motion.a>
        ))}
      </div>
    </motion.footer>
  );
}
