import React, { useState, useContext } from "react";
import axios from "axios";
import { OwnerAuthContext } from "../OwnerContextAuth.jsx";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import url from "../../url";

const OwnerLogin = () => {
  const { setOwnerToken } = useContext(OwnerAuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    try {
      const response = await axios.post(`${url}owner/login`, formData);
      setResponseMessage("Login successful!");
      setOwnerToken(response.data.ownerToken || "No token returned");
      localStorage.setItem("ownerToken", response.data.ownerToken);
      navigate("/owner/dash");
    } catch (error) {
      setResponseMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <MdOutlineLogin className="text-blue-500 text-6xl" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-sm">
            Login to access your dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Enter your Email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              required
            />
            {errors.email && (
              <small className="text-red-500">{errors.email}</small>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your Password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <small className="text-red-500">{errors.password}</small>
            )}
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            type="submit">
            Login
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-4 text-center">
          <Link
            to="/owner/forgot"
            className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <a href="/owner/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Response Message */}
        {responseMessage && (
          <p className="mt-4 text-center text-gray-700">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OwnerLogin;
