import homeImage from "../../img/house.png";
import menu from "../../img/menus.png";
import close from "../../img/close.png";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
import { useWishListContext } from "../WishListContext.jsx";

const Header = () => {
  const [show, setShow] = useState(false);
  const { token } = useContext(AuthContext);
  const { wishList } = useWishListContext(); // Get wishList from the context

  const handleClick = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={homeImage}
            alt="FindHome Logo"
            className="h-10 w-auto transition-transform duration-300 hover:scale-105"
          />
          <span className="ml-2 text-xl font-bold text-indigo-700">
            FindHome
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300">
                Favorite
              </Link>
              <sup className="text-red-500 text-[15px]  font-bold">
                {wishList?.length || 0}{" "}
                {/* Display wishlist length if available */}
              </sup>
            </li>
            {token ? (
              <li>
                <Link
                  to="/user/dashbord"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                  Profile
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={handleClick}
            className="focus:outline-none"
            aria-label="Open menu">
            <img src={menu} alt="Menu" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}>
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 p-5 ${
            show ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end mb-6">
            <button onClick={handleClose} className="focus:outline-none">
              <img src={close} alt="Close menu" className="h-6 w-6" />
            </button>
          </div>

          <ul className="space-y-6">
            <li>
              <Link
                to="/"
                className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
                onClick={handleClose}>
                Home
              </Link>
            </li>
            {token ? (
              <li>
                <Link
                  to="/user/dashbord"
                  className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-center"
                  onClick={handleClose}>
                  Profile
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
                    onClick={handleClose}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-center mt-4"
                    onClick={handleClose}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
