import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        textAlign: "center",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <header className="header">
        <div className="navList">
          <ul className="ulCont">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#aboutUs">About</a>
            </li>
            <li>
              <a href="#connectContID">Connect</a>
            </li>
          </ul>
        </div>
      </header>
    </motion.header>
  );
};

export default Header;
