import { motion } from "framer-motion";
const socialLinks = [
  { href: "mailto:yashmk2004@gmail.com", label: "Email" },
  { href: "https://github.com/khalkaryash", label: "GitHub" },
  { href: "https://yashkhalkar.vercel.app", label: "Website" },
  { href: "https://in.linkedin.com/in/yashkhalkar", label: "LinkedIn" },
  { href: "https://www.instagram.com/yashkhalkar001", label: "Instagram" },
  { href: "https://www.x.com/yashkhalkar001", label: "X" },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-10 border-t border-border text-center"
    >
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em] mb-6">
        © 2026 Yash Khalkar
      </p>

      <div className="flex flex-wrap justify-center gap-x-7 gap-y-3">
        {socialLinks.map((social) => (
          <motion.a
            key={social.label}
            href={social.href}
            target={social.href.startsWith("mailto") ? undefined : "_blank"}
            rel={
              social.href.startsWith("mailto")
                ? undefined
                : "noopener noreferrer"
            }
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
            whileHover={{ y: -2 }}
          >
            {social.label}
          </motion.a>
        ))}
      </div>
    </motion.footer>
  );
}
