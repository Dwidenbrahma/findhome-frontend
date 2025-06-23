import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import url from "../url";

// Create the context
const HomeContext = createContext();

// Create the provider component
export const HomeProvider = ({ children }) => {
  const [homeData, setHomeData] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchHomes = async () => {
      setIsLoading(true);
      try {
        // Fetch all data once
        const response = await axios.get(`${url}`);
        setHomeData(response.data);
        setFilteredHomes(response.data); // Initially, show all homes
      } catch (error) {
        console.error("Error fetching homes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomes();
  }, []); // Fetch once when component mounts

  useEffect(() => {
    let filtered = homeData;

    if (activeTab !== "All") {
      if (activeTab === "rent" || activeTab === "buy") {
        filtered = homeData.filter(
          (home) => home.transactionType === activeTab
        );
      } else if (activeTab === "Student" || activeTab === "general") {
        filtered = homeData.filter((home) => home.category === activeTab);
      } else {
        filtered = homeData.filter((home) => home.type === activeTab);
      }
    }

    setFilteredHomes(filtered);
  }, [activeTab, homeData]);

  return (
    <HomeContext.Provider
      value={{ homeData, filteredHomes, isLoading, activeTab, setActiveTab }}>
      {children}
    </HomeContext.Provider>
  );
};

// Custom hook to use HomeContext
export const useHomeContext = () => {
  return useContext(HomeContext);
};
