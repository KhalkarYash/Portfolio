import logoImg from "../../public/logo.jpg";

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="nav-items">
          <div className="logo-cont">
            <img src={logoImg} alt="logo" />
          </div>
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
  );
};

export default Header;
