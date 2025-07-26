"use client";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollTo } from "@/hooks/useScrollTo";
import NavigationDots from "@/components/ui/NavigationDots";
import PageTransition from "@/components/ui/PageTransition";

// Dynamically import heavy components
const AnimatedSphere = dynamic(
  () => import("@/components/three/AnimatedSphere"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gradient-to-b from-purple-900/20 to-transparent" />
    ),
  }
);

const ParticleBackground = dynamic(
  () => import("@/components/ui/ParticleBackground"),
  {
    ssr: false,
  }
);

const About = dynamic(() => import("@/components/sections/About"));
const Education = dynamic(() => import("@/components/sections/Education"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scrollTo = useScrollTo();
  const sections = [
    "home",
    "about",
    "education",
    "experience",
    "projects",
    "contact",
  ];

  return (
    <main className="relative">
      {/* <LoadingScreen /> */}

      <ParticleBackground />
      <PageTransition>
        <section
          id="home"
          className="h-screen flex items-center justify-center relative overflow-hidden"
        >
          <motion.div style={{ opacity }} className="absolute inset-0">
            <AnimatedSphere />
          </motion.div>
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold gradient-text mb-6">
                Yash Khalkar
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xl sm:text-2xl text-gray-300 mb-8">
                Full Stack Developer & Creative Coder
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center flex-col md:flex-row gap-4"
            >
              <button
                onClick={() => scrollTo("projects")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-full 
                hover:scale-105 transition-transform duration-200 font-medium"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="border border-white text-white px-3 md:px-6 py-2 md:py-3 rounded-full 
                hover:bg-white hover:text-black transition-colors duration-200 font-medium"
              >
                Contact Me
              </button>
              <button
                onClick={() => {
                  window.open(
                    "https://1drv.ms/f/c/c4ef5729b36ead51/Eso0Nur2bClDs1i99koJ_lcBocyPOGCuRdH-W-Lb-rrlRQ",
                    "_blank"
                  );
                }}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-3 md:px-6 py-2 md:py-3 rounded-full 
                hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-200 font-medium"
              >
                Resume
              </button>
            </motion.div>
          </div>
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-sm cursor-pointer"
            onClick={() => scrollTo("about")}
          >
            Scroll Down
            <div className="w-6 h-6 mx-auto mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </section>

        <section id="about">
          <About />
        </section>
        <section id="education">
          <Education />
        </section>
        <section id="experience">
          <Experience />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </PageTransition>
      <NavigationDots sections={sections} />
    </main>
  );
}
