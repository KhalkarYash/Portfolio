const ProjectCard = ({ prData }) => {
  const { image, name, description, githubLink, techStack, liveLink } = prData;
  return (
    <div className="project-card">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>{description}</p>
      <div className="projBtnCont">
        {liveLink && (
          <a href={liveLink} target="_blank">
            <button>Live Link</button>
          </a>
        )}
        <a href={githubLink} target="_blank">
          <button>GitHub Link</button>
        </a>
      </div>
      <div className="techStack">
        {techStack.length > 0 ? (
          techStack.map((tech, index) => (
            <span key={index} className="tech-item">
              {tech}
            </span>
          ))
        ) : (
          <span>No Tech Stack Provided</span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
