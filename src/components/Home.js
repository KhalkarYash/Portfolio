import React from "react";
import Typed from "typed.js";
import myImgPath from "../../public/images/yash.jpg";

const Home = () => {
  const el = React.useRef(null);

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
      <div className="imgContainer">
        <img src={myImgPath} alt="Yash Khalkar" />
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
      <a href="https://drive.google.com/file/d/1XStazw9u1LUu84X8NHOX2Yml4fglkuwm/">
        <button className="resumeBtn">Resume</button>
      </a>
    </div>
  );
};

export default Home;
