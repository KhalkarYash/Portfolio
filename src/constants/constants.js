import alarmClock from "../assets/alarmClock.jpg";
import blogProject from "../assets/blogProject.jpg";
import collegeMarkTracker from "../assets/collegeMarkTracker.jpg";
import movieRecommendationProject from "../assets/movieRecommendationProject.jpg";
import namasteFood from "../assets/namasteFood.jpg";
import todoProject from "../assets/todoProject.jpg";
import bingeBrain from "../assets/bingeBrain.jpg";
import passwordGenerator from "../assets/passwordGenerator.jpg";
import devLinkUp from "../assets/devLinkUp.jpg";

export const resumeDriveLink =
  "https://1drv.ms/f/c/c4ef5729b36ead51/Eso0Nur2bClDs1i99koJ_lcBocyPOGCuRdH-W-Lb-rrlRQ";

// Example of project object

// {
//   image: image Import name,
//   name: "Project Name",
//   description: "Project Description",
//   githubLink: "Github Link",
//   techStack: ["TechStack1","TechStack2",..."TechStackN"] Array of Tech Stack,
//   liveLink: "Link of the project if is live",
// }

export const projects = [
  {
    image: devLinkUp,
    name: "DevLinkUp",
    description:
      "A developer matchmaking platform, that helps devs connect, collaborate, and build projects together.",
    githubLink: "https://github.com/KhalkarYash/dev-link-up-frontend",
    techStack: ["MERN", "TailwindCSS", "Socket.io"],
    liveLink: "https://devlinkup.vercel.app",
  },
  {
    image: collegeMarkTracker,
    name: "College Mark Tracker",
    description:
      "A web application designed to help students track their academic performance and manage their grades effectively.",
    githubLink: "https://github.com/KhalkarYash/college-mark-tracker",
    techStack: ["Django", "BootStrap"],
    liveLink: "https://college-mark-tracker.onrender.com/",
  },
  {
    image: bingeBrain,
    name: "BingeBrain",
    description: "Netflix and chill, but with a twist of AI.",
    githubLink: "https://github.com/KhalkarYash/netflix-gpt-react",
    techStack: [
      "ReactJS",
      "Firebase",
      "React Redux",
      "Redux Toolkit",
      "GeminiAI",
      "TailwindCSS",
    ],
    liveLink: "https://khalkaryash.github.io/BingeBrain-React/",
  },
  {
    image: namasteFood,
    name: "Namaste Food",
    description: "Online Food Ordering Site.",
    githubLink: "https://github.com/KhalkarYash/Namaste-Food-React",
    techStack: [
      "ReactJS",
      "React Redux",
      "Redux Toolkit",
      "TailwindCSS",
      "Jest",
    ],
    liveLink: "https://khalkaryash.github.io/Namaste-Food-React/",
  },
  {
    image: passwordGenerator,
    name: "Password Generator",
    description: "Random Password Generator.",
    githubLink:
      "https://github.com/KhalkarYash/Random-Password-Generator-React",
    techStack: [
      "ReactJS",
      "React Redux",
      "Redux Toolkit",
      "TailwindCSS",
      "Jest",
    ],
    liveLink: "https://khalkaryash.github.io/Random-Password-Generator-React/",
  },
  {
    image: movieRecommendationProject,
    name: "Movie Recommendation System",
    description: "A web app to recommend movies based on genres.",
    githubLink: "https://github.com/KhalkarYash/Movie-Recommendation-System",
    techStack: ["HTML", "CSS", "JavaScript", "TMDb API"],
    liveLink: "https://khalkaryash.github.io/Movie-Recommendation-System/",
  },
  {
    image: blogProject,
    name: "Blog Project",
    description:
      "A blogging platform developed as part of web development training, allowing users to create and manage blog posts.",
    githubLink: "https://github.com/KhalkarYash/Blog-Project-Web-Training",
    techStack: ["HTML", "CSS", "JavaScript"],
    liveLink: "https://khalkaryash.github.io/Blog-Project-Web-Training/",
  },
  {
    image: alarmClock,
    name: "Alarm Clock",
    description:
      "A functional alarm clock application built using JavaScript to set and manage alarms.",
    githubLink: "https://github.com/KhalkarYash/AlarmClock",
    techStack: ["HTML", "CSS", "JavaScript"],
    liveLink: "https://khalkaryash.github.io/AlarmClock/",
  },
  {
    image: todoProject,
    name: "todo List",
    description:
      "A comprehensive web development project demonstrating proficiency in HTML, CSS, and JavaScript.",
    githubLink: "https://github.com/KhalkarYash/Final-Project-Web-Dev",
    techStack: ["HTML", "CSS", "JavaScript"],
    liveLink: "https://khalkaryash.github.io/Final-Project-Web-Dev/",
  },
];
