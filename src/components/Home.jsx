import React, { useState } from "react";
import Typed from "typed.js";
// import myImgPath from "../assets/yash.jpg";
import { resumeDriveLink } from "../constants/constants";

const Home = () => {
  const el = React.useRef(null);
  const [imageLoading, setImageLoading] = useState(true);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Web Design",
        "Open Source",
        "System Design",
        "JavaScript Programming",
        "Full Stack Development",
      ],
      typeSpeed: 70,
      backSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="home">
      {imageLoading && <div className="spinner"></div>}
      <div
        className="imgContainer"
        style={{ display: imageLoading ? "none" : "block" }}
      >
        <img
          src="/images/yash.jpg"
          onLoad={() => setImageLoading(false)}
          alt="Yash Khalkar"
        />
      </div>
      <div className="homeData">
        <p>
          Hey, I'm <span className="name">Yash Khalkar</span>. Here, you can
          check out what I've worked on. I try my best to create everything with{" "}
          <span id="heart">❤️</span>
        </p>
        <p>
          - I'm interested in <span id="typedText" ref={el}></span>
        </p>
      </div>
      <div className="resumeBtnCont">
        <a href={resumeDriveLink}>
          <button className="resumeBtn">Resume</button>
        </a>
      </div>
    </div>
  );
};

export default Home;
