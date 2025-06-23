import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext.jsx";
import url from "../../url.jsx";
import Header from "../header/Header.jsx";

const Login = () => {
  const [response, setResponse] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessasge] = useState(null);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleValue = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}login`, {
        email: formData.email,
        password: formData.password,
      });

      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);

      setResponse(response.data.message);
      navigate("/user/dashbord"); // Navigate after setting the token
    } catch (error) {
      console.log("Login error" + error);
      setToken(null);
      localStorage.removeItem("token");

      if (error.response && error.response.data) {
        setErrorMessasge(error.response.data.message || "An error occurred");
      } else {
        setErrorMessasge("An unexpected error occurred. Please try again");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Link
          className="absolute top-4 left-4 text-blue-600 hover:text-blue-800"
          to="/">
          <FaHome size={30} />
        </Link>

        <div className="w-full max-w-md">
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-white py-8 px-6 shadow rounded-lg">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Sign in
              </h1>

              <div className="space-y-5 mb-6">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleValue}
                />
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleValue}
                />
                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
                  Login
                </button>
              </div>

              <div className="text-center">
                <div className="flex justify-between text-blue-600">
                  <Link className="hover:underline" to={"/forgot"}>
                    Forgot password
                  </Link>
                  <Link className="hover:underline" to={"/register"}>
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {response && (
            <p className="text-center text-green-600 mt-4">{response}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
