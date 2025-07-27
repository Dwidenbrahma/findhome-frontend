import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { OwnerAuthContext } from "../OwnerContextAuth";
import ManageProperty from "./MangeProperty";
import FeedbackSection from "./FeedbackSection";
import ManageCustomers from "./ManageCustomers";

import axios from "axios";
import url from "../../url";
import {
  FaBell,
  FaChartBar,
  FaHome,
  FaEdit,
  FaUsers,
  FaSignOutAlt,
  FaCommentAlt,
  FaList,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";

const OwnerDashboard = () => {
  const { ownerToken, loading } = useContext(OwnerAuthContext);
  const [ownerData, setOwnerData] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [property, setProperties] = useState(0);

  // fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}owner/dash`, {
          headers: {
            Authorization: `Bearer ${ownerToken}`,
          },
        });

        setOwnerData(response.data.admin);
        setProperties(response.data.totalProperties);
      } catch (error) {
        setOwnerData("Error: " + error.message);
      }
    };

    if (ownerToken) {
      fetchData();
    }
  }, [ownerToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    window.location.href = "/owner/login";
  };

  if (!ownerToken) return <Navigate to="/owner/login" replace />;

  // Menu items configuration
  const menuItems = [
    {
      id: "analysis",
      label: "Analysis",
      icon: <FaChartBar className="mr-3" />,
    },
    {
      id: "manage",
      label: "Manage Property",
      icon: <MdManageAccounts className="mr-3" />,
    },
    {
      id: "post",
      label: "Post Property",
      icon: <FaHome className="mr-3" />,
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: <FaCommentAlt className="mr-3" />,
    },

    {
      id: "customers",
      label: "Manage Customers",
      icon: <FaUsers className="mr-3" />,
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "manage":
        return <ManageProperty />;
      case "post":
        return <Navigate to="/owner/dash/posthome" replace />;
      case "feedback":
        return <FeedbackSection />;
      case "customers":
        return <ManageCustomers />;

      default:
        return (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img
                src="/api/placeholder/400/300"
                alt="development"
                className="w-64 h-64 object-contain opacity-25"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-400 mt-6">
              Feature is in Development...
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  Properties
                </h3>
                <p className="text-3xl font-bold">{property || 0}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Active Bookings
                </h3>
                <p className="text-3xl font-bold">
                  {ownerData?.activeBookings || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  Revenue
                </h3>
                <p className="text-3xl font-bold">
                  ₹{ownerData?.revenue?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-700">OwnerDash</div>
          </div>
          <div className="flex items-center">
            <button className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
              <FaBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row container mx-auto px-4 py-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-md overflow-hidden mb-6 md:mb-0 md:mr-6">
          <div className="p-6 border-b border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 mb-4">
              <img
                src={
                  ownerData?.profileImage
                    ? ownerData.profileImage // ✅ Use directly
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        ownerData?.name || "Owner"
                      )}&background=6366f1&color=fff`
                }
                alt="owner-profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {ownerData?.name || "Property Owner"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {ownerData?.email || "owner@example.com"}
            </p>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeMenu === item.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                    }`}>
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>{" "}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        <div className="flex-grow bg-white rounded-xl shadow-md p-6">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FindHome Owner Dashboard. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default OwnerDashboard;
