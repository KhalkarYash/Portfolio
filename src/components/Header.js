import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logoImg from "../../public/logo.jpg";

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
      <header>
        <div className="header">
          <div className="nav-items">
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
              </ul>
            </div>
          </div>
          <div className="connectButton">
            <button className="connectBtn">
              <a href="#connectContID">Connect</a>
            </button>
          </div>
        </div>
      </header>
    </motion.header>
  );
};

export default Header;
