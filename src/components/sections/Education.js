'use client'
import { motion } from 'framer-motion'

const educationData = [
  {
    period: "2023 - 2026",
    degree: "Bachelor of Engineering in Computer Science",
    institution: "Savitribai Phule Pune University",
    // description: "Core focus on Computer Science fundamentals, Data Structures, Algorithms, and Software Engineering"
  },
  {
    period: "2020 - 2023",
    degree: "Diploma in Computer Technology",
    institution: "Government Polytechnic, Nashik",
    // description: "Specialized in Science with Computer Science"
  }
]

export default function Education() {
  return (
    <section id="education" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
        >
          Education
        </motion.h2>
        
        <div className="max-w-3xl mx-auto">
          {educationData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative pl-8 pb-12 last:pb-0"
            >
              {/* Timeline line */}
              <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>
              
              {/* Timeline dot */}
              <div className="absolute left-[-4px] top-2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
              
              {/* Content */}
              <div className="bg-dark-secondary/30 backdrop-blur-sm rounded-lg p-6 hover:bg-dark-secondary/40 transition-all duration-300">
                <span className="text-sm text-purple-400">{item.period}</span>
                <h3 className="text-xl font-bold mt-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {item.degree}
                </h3>
                <p className="text-lg text-gray-300 mt-1">{item.institution}</p>
                {/* <p className="text-gray-400 mt-2">{item.description}</p> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}