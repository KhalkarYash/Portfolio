import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Globe from "../three/Globe";
import { useParallax } from "@/hooks/useParallax";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { ref: textRef, y: textY } = useParallax(50, "right");
  const { ref: modelRef, y: modelY } = useParallax(50, "left");

  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "Bootstrap", "Tailwind CSS", "DaisyUI"],
    },
    {
      title: "Backend",
      skills: [
        "Node.js",
        "Express",
        "MongoDB",
        "Mongoose",
        "RESTful APIs",
        "MySQL",
        "SQLite",
      ],
    },
    {
      title: "Languages",
      skills: ["C", "C++", "Java", "Python", "PHP"],
    },
    {
      title: "Miscellaneous",
      skills: ["Git", "Github", "Firebase"],
    },
  ];

  return (
    <section id="about" className="min-h-screen py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div ref={textRef} style={{ y: textY }} className="space-y-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold gradient-text"
            >
              About Me
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-300"
            >
              I&apos;m a passionate Full Stack Developer with expertise in
              modern web technologies. My journey in software development has
              been driven by curiosity and a desire to create impactful digital
              experiences.
            </motion.p>
            <div className="space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl font-semibold text-purple-400"
              >
                Skills
              </motion.h3>
              <div className="grid grid-cols-2 gap-4">
                {skillCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <h4 className="text-white font-medium">{category.title}</h4>
                    <ul className="text-gray-400 space-y-1">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.li
                          key={skill}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.5 + skillIndex * 0.1,
                          }}
                        >
                          {skill}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            ref={modelRef}
            style={{ y: modelY }}
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative w-68 h-68 mx-auto rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/yash.jpg"
                alt="Yash's profile"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <div className="h-[400px] relative">
              <Canvas camera={{ position: [0, 0, 2.5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <OrbitControls
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
                <Globe />
              </Canvas>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
