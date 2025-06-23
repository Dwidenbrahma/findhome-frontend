import React, { useState } from "react";
import axios from "axios";
import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";
import { Link } from "react-router-dom";
import url from "../../url.jsx";

const Register = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "", // Will hold the file object
    phone: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Handle input changes for text fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input change for profile image
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0], // Save the file object in the state
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data object to send to the backend
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("profileImage", formData.profileImage); // Append the file
    formDataToSend.append("phone", formData.phone);

    try {
      // Send the form data via Axios
      const response = await axios.post(`${url}register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      setResponseMessage("Profile created successfully!");
      window.location.href = "/user/dashbord";
      console.log("Response:", response.data);
    } catch (error) {
      setResponseMessage("Error creating profile.");
      console.error("There was an error!", error);
    }
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Findhome!
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our community to explore and book your dream home today!
              Creating an account is quick and easy — just fill out the details
              below. Already registered?{" "}
              <Link
                className="text-blue-600 hover:text-blue-800 hover:underline"
                to="/login">
                Login here
              </Link>
            </p>
          </div>

          <form
            className="bg-white shadow-md rounded-lg p-8 mb-6"
            onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Profile Image:
              </label>
              <input
                className="w-full text-gray-700 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                name="profileImage"
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              type="submit">
              Sign Up
            </button>
          </form>

          {responseMessage && (
            <div
              className={`text-center p-4 rounded ${
                responseMessage.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
              {responseMessage}
            </div>
          )}
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Register;
