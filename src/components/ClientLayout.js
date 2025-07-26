"use client";
import { useEffect, useState } from "react";
// import LoadingScreen from "./ui/LoadingScreen";
import AnimatedCursor from "./ui/AnimatedCursor";
import ScrollProgress from "./ui/ScrollProgress";
import ImagePreloader from "./ui/ImagePreloader";
import KeyboardShortcutsHelper from "./ui/KeyboardShortcutsHelper";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { trackEvent } from "@/utils/analytics";
import BlurOnLoad from "./BlurOnPage";

const sections = ["home", "about", "education", "projects", "contact"];

export default function ClientLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  usePerformanceMetrics();
  useKeyboardShortcuts(sections);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Add loading class for initial animations
    document.body.classList.add("loading");

    // Remove loading state after initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove("loading");
      trackEvent("page_loaded", {
        loadTime: performance.now(),
        isMobile: window.innerWidth < 768,
      });
    }, 2000);

    // Add keyboard navigation class to body
    const handleFirstTab = (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
        window.removeEventListener("keydown", handleFirstTab);
        trackEvent("keyboard_navigation_start", {
          timestamp: new Date().toISOString(),
        });
      }
    };
    window.addEventListener("keydown", handleFirstTab);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", handleFirstTab);
      clearTimeout(timer);
    };
  }, []);

  // Touch event handlers for mobile
  const handleTouch = {
    onTouchStart: (e) => {
      setTouchStart(e.touches[0].clientY);
      trackEvent("touch_interaction_start", {
        timestamp: new Date().toISOString(),
      });
    },
    onTouchMove: (e) => {
      if (!touchStart) return;
      const touchEnd = e.touches[0].clientY;
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 5) {
        e.preventDefault();
      }
    },
    onTouchEnd: () => {
      setTouchStart(null);
      trackEvent("touch_interaction_end", {
        timestamp: new Date().toISOString(),
      });
    },
  };

  return (
    <BlurOnLoad>
      <div
        {...handleTouch}
        className="touch-pan-y min-h-screen"
        onMouseMove={() =>
          document.body.classList.remove("keyboard-navigation")
        }
      >
        <ImagePreloader />
        {!isMobile && <AnimatedCursor />}
        <ScrollProgress />
        {/* {isLoading && <LoadingScreen />} */}
        <KeyboardShortcutsHelper />
        <div
          className={`transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {children}
        </div>
      </div>
    </BlurOnLoad>
  );
}
