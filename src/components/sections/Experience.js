"use client";
import { motion } from "framer-motion";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function Experience() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <div className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-computer-icon lucide-computer"
              >
                <rect width="14" height="8" x="5" y="2" rx="2" />
                <rect width="20" height="8" x="2" y="14" rx="2" />
                <path d="M6 18h2" />
                <path d="M12 18h6" />
              </svg>
              AI Intern
            </div>
          </div>
          <div className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-building2-icon lucide-building-2"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
              Infosys Springboard
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <div className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-computer-icon lucide-computer"
              >
                <rect width="14" height="8" x="5" y="2" rx="2" />
                <rect width="20" height="8" x="2" y="14" rx="2" />
                <path d="M6 18h2" />
                <path d="M12 18h6" />
              </svg>
              Frontend Intern
            </div>
          </div>
          <div className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-building2-icon lucide-building-2"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
              Zenzop
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
      >
        Experience
      </motion.h2>
      <Timeline data={data} />
    </div>
  );
}
