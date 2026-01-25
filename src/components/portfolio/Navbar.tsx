import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 liquid-glass-nav"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-2.5 h-2.5"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut' 
            }}
          >
            <div className="absolute inset-0 rounded-full bg-primary" />
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">
            Available for work
          </span>
        </div>
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
