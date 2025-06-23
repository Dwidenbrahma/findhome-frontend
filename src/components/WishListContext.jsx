import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import url from "../url"; // Assuming AuthContext provides user authentication (token)

const WishListContext = createContext();

export const useWishListContext = () => {
  return useContext(WishListContext);
};

const WishListProvider = ({ children }) => {
  const { token } = useContext(AuthContext); // Get the JWT token from AuthContext
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWishList(); // Fetch wishlist if token is available
    }
  }, [token]);

  const fetchWishList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}find-wish-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishList(response.data.propertyIds); // Set the fetched property IDs to state
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishListContext.Provider value={{ wishList, loading, fetchWishList }}>
      {children}
    </WishListContext.Provider>
  );
};

export default WishListProvider;
