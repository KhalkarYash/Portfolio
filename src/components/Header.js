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
            <ul id="ulCont">
              <li>
                <a href="#">Home</a>
              </li>
              <pre>   </pre>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <pre>   </pre>

              <li>
                <a href="#aboutUs">About</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="connectButton">
          <button className="connectBtn">
            <a href="#foot">Connect</a>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
