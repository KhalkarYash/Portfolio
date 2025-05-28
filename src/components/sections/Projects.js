import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticCard from "../ui/MagneticCard";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "DevLinkUp",
    description:
      "A developer matchmaking platform, that helps devs connect, collaborate, and build projects together.",
    image: "/devLinkUp.jpg",
    tech: ["MERN", "AWS", "Razorpay", "Socket.IO", "Tailwind CSS", "DaisyUI"],
    link: "https://devlinkup.vercel.app",
    github: "https://github.com/KhalkarYash/dev-link-up-frontend",
  },
  {
    title: "BingeBrain",
    description: "Netflix and chill, but with a twist of AI.",
    image: "/bingeBrain.jpg",
    tech: [
      "ReactJS",
      "Firebase",
      "React Redux",
      "Redux Toolkit",
      "GeminiAI",
      "TailwindCSS",
    ],
    link: "https://khalkaryash.github.io/BingeBrain-React/",
    github: "https://github.com/KhalkarYash/netflix-gpt-react",
  },
  // https://github.com/KhalkarYash/skillzy-frontend-mern
  {
    title: "Breast Cancer Detection",
    description: "Netflix and chill, but with a twist of AI.",
    image: "/bcd.jpg",
    tech: [
"Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Streamlit"
    ],
    link: "https://bcd-project.streamlit.app",
    github: "https://github.com/KhalkarYash/bcd",
  },
  {
    title: "College Mark Tracker",
    description:
      "A web application designed to help students track their academic performance and manage their grades effectively.",
    image: "/collegeMarkTracker.jpg",
    tech: ["Django", "Bootstrap", "MySQL"],
    link: "https://college-mark-tracker.onrender.com/",
    github: "https://github.com/KhalkarYash/college-mark-tracker",
  },
  {
    title: "Skillzy",
    description: "A basic MERN course website with admin and user access.",
    image: "/skillzy.jpg",
    tech: ["MERN", "JWT", "Redux", "Redux Persist", "TailwindCSS"],
    link: "https://skillzy-frontend-mern.vercel.app",
    github: "https://github.com/KhalkarYash/skillzy-frontend-mern",
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const projectRefs = useRef([]);

  useEffect(() => {
    projectRefs.current.forEach((project, index) => {
      gsap.from(project, {
        scrollTrigger: {
          trigger: project,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
      });
    });
  }, []);

  return (
    <section id="projects" className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-16 text-center gradient-text"
        >
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <MagneticCard key={index} className="h-full">
              <motion.div
                ref={(el) => (projectRefs.current[index] = el)}
                className="bg-dark-secondary rounded-xl p-6 h-full flex flex-col transform 
                  transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    layout="responsive"
                    className="object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4 gradient-text">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  {project.description}
                </p>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      Live Demo →
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              </motion.div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
}
