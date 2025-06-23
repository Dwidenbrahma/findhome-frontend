import React, { useState, useEffect } from "react";
import img1 from "./images/img1.jpg";
import img2 from "./images/img2.jpg";
import img3 from "./images/img3.jpg";
import axios from "axios";
//import { Link } from "react-router-dom";
import url from "../../url.jsx";
import { Link } from "react-router-dom";

const imageCollection = [img1, img2, img3];

const Owner = () => {
  const [index, setRandomIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [formData, setFormData] = useState({
    fName: "",
    email: "",
    password: "",
    profileImage: "",
    phone: "",
  });

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      if (value.length < 6) {
        setPasswordStrength("Weak");
      } else if (value.length >= 6 && value.length < 10) {
        setPasswordStrength("Moderate");
      } else {
        setPasswordStrength("Strong");
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0],
    });
  };

  useEffect(() => {
    const randomNumber = setInterval(() => {
      setRandomIndex(Math.floor(Math.random() * 3));
    }, 8000);

    return () => clearInterval(randomNumber);
  }, []);

  useEffect(() => {
    if (index != null) {
      console.log(index);
    }
  }, [index]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.fName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("profileImage", formData.profileImage);
    formDataToSend.append("phone", formData.phone);

    try {
      const response = await axios.post(`${url}list/register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponseMessage("Profile created successfully!");
      window.location.href = "/owner/dash";
      console.log("Response:", response.data);
    } catch (error) {
      setResponseMessage("Error creating profile.");
      console.error("There was an error!", error);
    }
  };

  return (
    <div className=" flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Left side - Info section */}
          <div className="md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 relative overflow-hidden">
              <img
                src={imageCollection[index]}
                alt="Property"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="  p-5 absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h1 className="text-2xl md:text-3xl font-bold text-white ">
                  Register to List Your Property on Findhome
                </h1>
              </div>
            </div>
            <hr className="border-1 border-[#E53888] mt-7 w-[150px] mx-auto" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Why Register with Us?
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#E53888]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Reach More Renters & Buyers:
                    </span>
                    <p className="text-gray-600">
                      Gain access to thousands of people looking for homes like
                      yours.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#E53888]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Quick and Simple Process:
                    </span>
                    <p className="text-gray-600">
                      Register and list your property in just a few easy steps.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#E53888]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Manage Listings Anytime:
                    </span>
                    <p className="text-gray-600">
                      Edit or remove your property listings whenever needed.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-5 flex gap-1 justify-center">
                <p className="text-[#484848] underline italic">
                  Already have an account?
                </p>
                <Link className="font-bold " to={"/owner/login"}>
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Form section */}
          <div className="md:w-1/2   bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Create Your Account
              </h2>

              <form className="space-y-5 " onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="fName"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fName}
                    name="fName"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53888] focus:border-[#E53888] transition duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53888] focus:border-[#E53888] transition duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53888] focus:border-[#E53888] transition duration-200"
                  />
                  {isFocused && (
                    <div className="mt-1 text-sm">
                      <span
                        className={`font-medium ${
                          passwordStrength === "Strong"
                            ? "text-green-600"
                            : passwordStrength === "Moderate"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}>
                        Password Strength: {passwordStrength}
                      </span>
                      <div className="h-1 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${
                            passwordStrength === "Strong"
                              ? "bg-green-500 w-full"
                              : passwordStrength === "Moderate"
                              ? "bg-yellow-500 w-2/3"
                              : "bg-red-500 w-1/3"
                          }`}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <label className="flex items-center justify-center w-full h-12 px-4 py-2 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                      <span className="text-sm text-gray-500">
                        Choose a file or drag and drop
                      </span>
                      <input
                        id="profileImage"
                        type="file"
                        name="profileImage"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {formData.profileImage && (
                    <p className="mt-1 text-sm text-gray-500 text-center">
                      Selected: {formData.profileImage.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    name="phone"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53888] focus:border-[#E53888] transition duration-200"
                  />
                </div>

                <div className="pt-3 flex justify-center">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#E53888] hover:bg-[#E53888] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53888] transition duration-200">
                    Create Account
                  </button>
                </div>
              </form>

              {responseMessage && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center ${
                    responseMessage.includes("success")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {responseMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
