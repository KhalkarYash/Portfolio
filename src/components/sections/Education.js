"use client";
import { motion } from "framer-motion";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function Education() {
  const data = [
    {
      title: "2023",
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-graduation-cap-icon lucide-graduation-cap"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </svg>
              Diploma in Computer Technology
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
                className="lucide lucide-university-icon lucide-university"
              >
                <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
                <path d="M18 12h.01" />
                <path d="M18 16h.01" />
                <path d="M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" />
                <path d="M6 12h.01" />
                <path d="M6 16h.01" />
                <circle cx="12" cy="10" r="2" />
              </svg>
              Government Polytechnic, Nashik
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2026",
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-graduation-cap-icon lucide-graduation-cap"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </svg>
              Bachelor of Engineering in Computer Science
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
                className="lucide lucide-university-icon lucide-university"
              >
                <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
                <path d="M18 12h.01" />
                <path d="M18 16h.01" />
                <path d="M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" />
                <path d="M6 12h.01" />
                <path d="M6 16h.01" />
                <circle cx="12" cy="10" r="2" />
              </svg>
              Savitribai Phule Pune University
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
        Education
      </motion.h2>
      <Timeline data={data} />
    </div>
  );
}
