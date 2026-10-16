import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Selected work", href: "#work-projects" },
  { label: "Writing", href: "#blogs" },
  { label: "Beyond work", href: "#beyond-work" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="site-nav fixed inset-x-0 top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">
        <a href="#home" className="site-mark" aria-label="Yash Khalkar, home">YK<span>.</span></a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="site-nav-link">{link.label}</a>
          ))}
          <ThemeToggle />
        </div>
        <div className="md:hidden"><ThemeToggle /></div>
      </div>
      <div className="mobile-nav mx-auto max-w-[1440px] px-6 pb-3 sm:px-10 md:hidden">
        <div className="flex gap-7 overflow-x-auto whitespace-nowrap">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="site-nav-link">{link.label}</a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
