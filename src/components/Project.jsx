import ProjectCard from "./ProjectCard";
import { projects } from "../constants/constants";

const Project = () => {
  return (
    <div className="project" id="projects">
      <h3>My Projects</h3>
      <div className="projectCardsContainer">
        {projects.map((pro, index) => {
          return <ProjectCard key={index} prData={pro} />;
        })}
      </div>
    </div>
  );
};

export default Project;
