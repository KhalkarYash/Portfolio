const ProjectCard = ({ prData }) => {
  const { image, name, description, githubLink, techStack } = prData;
  return (
    <div className="project-card">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <p>{description}</p>
      <a href={githubLink}>
        <button>GitHub Link</button>
      </a>
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
