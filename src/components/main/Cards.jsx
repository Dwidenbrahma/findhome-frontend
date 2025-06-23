import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHomeContext } from "../HomeContext";
import url from "../../url"; // Adjust the path as necessary
import axios from "axios";
import { AuthContext } from "../AuthContext";

const Card = () => {
  const { filteredHomes, isLoading, setActiveTab, activeTab } =
    useHomeContext();
  const { token } = useContext(AuthContext);
  const tabs = [
    "All",
    "Flat",
    "Apartment",
    "Hotel",
    "Villa",
    "rent",
    "buy",
    "Student",
  ];

  const addFavorite = async (propertyId) => {
    try {
      // Example API call to add the home to the user's favorites
      const response = await axios.post(
        `${url}favorite`,
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added to favorites:", response.data);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm mb-8">
        <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium cursor-pointer transition-all duration-300 ${
                tab === activeTab
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}>
              {tab}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          filteredHomes.map((home) => (
            <div
              key={home._id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="relative">
                <div className="h-56 overflow-hidden">
                  <img
                    src={`${url}${home.images[0]}`}
                    alt={`house in ${home.location}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => addFavorite(home._id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L10 18.364l5.682-5.682a4.5 4.5 0 00-6.364-6.364L10 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {home.location}, India
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {home.description}
                    </p>
                    <p className="font-bold text-gray-900">
                      {new Intl.NumberFormat("hi-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(home.price)}
                      <span className="font-normal text-gray-600 ml-1">
                        night
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-indigo-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-indigo-800 font-medium text-sm">
                      {home.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    home.availability === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {home.availability || "Status Unknown"}
                </span>
                <Link to={`/info/${home._id}/${home.type}`}>
                  <span className="text-indigo-500 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300 flex items-center">
                    View details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Card;
