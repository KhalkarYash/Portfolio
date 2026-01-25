import { motion } from "framer-motion";
import { FileText, Grid3X3, Home, MessageSquare, BookOpen } from "lucide-react";

const menuItems = [
  { icon: Home, href: "#", label: "Home" },
  { icon: Grid3X3, href: "#projects", label: "Projects" },
  { icon: BookOpen, href: "#blogs", label: "Blogs" },
  {
    icon: FileText,
    href: "https://onedrive.live.com/embed?resid=YOUR_RESUME_ID",
    label: "Resume",
    external: true,
  },
  { icon: MessageSquare, href: "#contact", label: "Contact" },
];

export function DockMenu() {
  return (
    <motion.div
      initial={{ y: 100, x: "-50%", opacity: 0 }} // Added x: "-50%"
      animate={{ y: 0, x: "-50%", opacity: 1 }} // Added x: "-50%"
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 z-50" // Removed -translate-x-1/2
    >
      <motion.nav
        className="liquid-glass-dock px-3 py-3 rounded-[22px] flex items-center gap-1"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {menuItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="relative p-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors group"
            whileHover={{
              scale: 1.2,
              y: -8,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={item.label}
          >
            {/* Hover background */}
            <motion.div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <item.icon className="w-5 h-5 relative z-10 group-hover:text-primary transition-colors" />

            {/* Tooltip */}
            <motion.span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg liquid-glass text-xs font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {item.label}
            </motion.span>
          </motion.a>
        ))}
      </motion.nav>
    </motion.div>
  );
}
