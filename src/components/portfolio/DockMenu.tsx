import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FileText, Grid3X3, Home, MessageSquare, BookOpen } from "lucide-react";
import { createPortal } from "react-dom";
import { Glass } from "@samasante/liquid-glass";
import { resumeLink } from "@/utils/constants";

const menuItems = [
  { icon: Home, href: "#", label: "Home", id: "home" },
  { icon: Grid3X3, href: "#projects", label: "Projects", id: "projects" },
  { icon: BookOpen, href: "#blogs", label: "Blogs", id: "blogs" },
  {
    icon: FileText,
    href: resumeLink,
    label: "Resume",
    external: true,
    id: "resume",
  },
  { icon: MessageSquare, href: "#contact", label: "Contact", id: "contact" },
];

/** Optics for the compact dock pill */
const dockOptics = {
  strength: 0.01,
  depth: 0.35,
  curvature: 0.12,
  dispersion: 0.15,
  frost: 18,
  brightness: 0.04,
  specular: 0.45,
  sheen: 0.4,
  sheenWidth: 4,
  sheenFalloff: 2.5,
  sheenAngle: 90,
  glow: 0.12,
  glowSpread: 0.25,
  glowFalloff: 2,
  bend: 0.25,
  bendWidth: 0.12,
} as const;

/** Optics for the active tab's inner glass pill */
const activeTabOptics = {
  strength: 0.018,
  depth: 0.45,
  curvature: 0.2,
  dispersion: 0.25,
  frost: 6,
  brightness: 0.06,
  specular: 0.65,
  sheen: 0.55,
  sheenWidth: 4,
  sheenFalloff: 2,
  sheenAngle: 90,
  glow: 0.18,
  glowSpread: 0.3,
  glowFalloff: 1.8,
  bend: 0.3,
  bendWidth: 0.13,
} as const;

/** Optics for the expanded state — slightly stronger */
const expandedDockOptics = {
  ...dockOptics,
  frost: 20,
  specular: 0.5,
  sheen: 0.45,
  brightness: 0.05,
} as const;

export function DockMenu() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevents scroll handler from fighting with click-driven tab changes
  const scrollLockRef = useRef(false);
  const scrollLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track which section is currently in view
  useEffect(() => {
    if (!mounted) return;
    const sectionIds = ["", "projects", "blogs", "", "contact"];

    const handleScroll = () => {
      // Skip scroll-based updates while a click is animating the page
      if (scrollLockRef.current) return;

      const scrollY = window.scrollY + window.innerHeight / 2;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        if (!sectionIds[i]) continue;
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollY >= el.offsetTop) {
          setActiveIndex(i);
          return;
        }
      }
      setActiveIndex(0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (index: number, external?: boolean) => {
      if (!external) {
        setActiveIndex(index);
        // Lock scroll handler so it doesn't snap the pill back during smooth scroll
        scrollLockRef.current = true;
        if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current);
        scrollLockTimerRef.current = setTimeout(() => {
          scrollLockRef.current = false;
        }, 900);
      }
    },
    [],
  );

  const handlePressStart = useCallback(() => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      setIsExpanded(true);
    }, 180); // slight delay to distinguish tap from hold
  }, []);

  const handlePressEnd = useCallback(() => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    // Collapse after a short delay so user can see the labels
    collapseTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 1200);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <LayoutGroup>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 md:hidden"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
      >
        <Glass
          optics={isExpanded ? expandedDockOptics : dockOptics}
          style={{
            borderRadius: 999, // Full pill shape
            boxShadow:
              "0 6px 32px -6px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.08)",
          }}
        >
          <motion.nav
            layout
            className="flex items-center justify-center"
            style={{
              gap: isExpanded ? 2 : 4,
              padding: isExpanded ? "6px 8px" : "6px 10px",
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 500,
                damping: 38,
                mass: 0.6,
              },
            }}
            onPointerDown={handlePressStart}
            onPointerUp={handlePressEnd}
            onPointerLeave={handlePressEnd}
          >
            {menuItems.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <motion.a
                  key={item.id}
                  layout
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!item.external) {
                      // Don't prevent default for anchor scroll
                    }
                    handleClick(index, item.external);
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex items-center justify-center"
                  style={{
                    textDecoration: "none",
                    WebkitTapHighlightColor: "transparent",
                    borderRadius: 999,
                    padding: isActive
                      ? isExpanded
                        ? "8px 14px"
                        : "8px 12px"
                      : isExpanded
                        ? "8px 10px"
                        : "8px",
                    gap: isActive || isExpanded ? 5 : 0,
                    minWidth: isActive ? "auto" : isExpanded ? "auto" : 40,
                    minHeight: 40,
                  }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 500,
                      damping: 38,
                      mass: 0.6,
                    },
                  }}
                >
                  {/* Active pill glass background */}
                  {isActive && (
                    <motion.div
                      layoutId="dock-active-glass"
                      className="absolute inset-0 overflow-hidden"
                      style={{ borderRadius: 999 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        mass: 0.6,
                      }}
                    >
                      <Glass
                        optics={activeTabOptics}
                        style={{
                          borderRadius: 999,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div style={{ width: "100%", height: "100%" }} />
                      </Glass>
                    </motion.div>
                  )}

                  {/* Icon */}
                  <motion.span
                    layout="position"
                    className="relative z-10 flex items-center justify-center"
                    style={{ flexShrink: 0 }}
                  >
                    <item.icon
                      style={{
                        width: isActive ? 20 : 18,
                        height: isActive ? 20 : 18,
                        color: isActive
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground) / 0.6)",
                        filter: isActive
                          ? "drop-shadow(0 0 4px hsl(var(--primary) / 0.3))"
                          : "none",
                        transition: "color 0.15s ease, filter 0.15s ease",
                      }}
                      strokeWidth={isActive ? 2.2 : 1.7}
                    />
                  </motion.span>

                  {/* Label — shown only for active tab, or all tabs when expanded */}
                  <AnimatePresence mode="popLayout">
                    {(isActive || isExpanded) && (
                      <motion.span
                        key={`label-${item.id}`}
                        layout="position"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{
                          opacity: { duration: 0.12 },
                          width: { type: "spring", stiffness: 500, damping: 38, mass: 0.6 },
                        }}
                        className="relative z-10 overflow-hidden whitespace-nowrap"
                        style={{
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 500,
                          lineHeight: 1,
                          letterSpacing: "-0.01em",
                          color: isActive
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted-foreground) / 0.7)",
                          transition: "color 0.15s ease",
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              );
            })}
          </motion.nav>
        </Glass>
      </motion.div>
    </LayoutGroup>,
    document.body,
  );
}
