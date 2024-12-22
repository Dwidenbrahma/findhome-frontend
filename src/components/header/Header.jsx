import homeImage from "../../img/house.png";
import menu from "../../img/menus.png";
import close from "../../img/close.png";
import header from "./Header.module.css";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";

const Header = () => {
  const [show, setShow] = useState(false);
  const { token } = useContext(AuthContext);

  const handleClick = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <nav className={header.nav}>
        <Link to="/">
          <div className={header.right}>
            <img className={header.logo} src={homeImage} alt="Home_image" />
          </div>
        </Link>

        <div className={`${header.left} ${show ? header.show : ""}`}>
          <div className={header.close}>
            <img
              onClick={handleClose}
              className={header.closelogo}
              src={close}
              alt="Close_menu"
            />
          </div>

          <ul className={header.ul}>
            <li className={header.li}>
              <Link className={header.link} to="/">
                Home
              </Link>
            </li>
            {token ? (
              <li className={header.li}>
                <Link className={header.link} to="/user/dashbord">
                  profile
                </Link>
              </li>
            ) : (
              <>
                <li className={header.li}>
                  <Link className={header.link} to="/login">
                    Login
                  </Link>
                </li>
                <li className={header.li}>
                  <Link className={header.link} to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className={header.line}>
          <img
            onClick={handleClick}
            className={header.hamberger}
            src={menu}
            alt="Menu"
          />
        </div>

        <div className={header.toShow}>
          <ul className={header.uli}>
            <li className={header.lii}>
              <Link className={header.link} to="/">
                Home
              </Link>
            </li>
            {token ? (
              <li className={header.lii}>
                <Link className={header.link} to="/user/dashbord">
                  profile
                </Link>
              </li>
            ) : (
              <>
                <li className={header.lii}>
                  <Link className={header.link} to="/login">
                    Login
                  </Link>
                </li>
                <li className={header.lii}>
                  <Link className={header.link} to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
