import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { OwnerAuthContext } from "../OwnerContextAuth";
import url from "../../url";
import { useNavigate } from "react-router-dom";

const ManageProperty = () => {
  const navigate = useNavigate();
  const { ownerToken } = useContext(OwnerAuthContext);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${url}owner/properties`, {
          headers: {
            Authorization: `Bearer ${ownerToken}`,
          },
        });
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    if (ownerToken) fetchProperties();
  }, [ownerToken]);

  const handleEdit = (id) => {
    navigate(`/owner/dash/edit/${id}`);
  };

  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this property?"
    );
    if (!confirmed) return;
    try {
      const response = await axios.delete(`${url}owner/delete/${id}`);

      console.log(response.data);
      setProperties((prev) => prev.filter((prop) => prop._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Properties</h1>
      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property._id} className="bg-white shadow rounded-lg p-4">
              <img
                src={
                  property.images?.[0]
                    ? `${url}${property.images[0]}`
                    : "https://via.placeholder.com/400x200?text=No+Image"
                }
                alt="property"
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
              <p className="text-gray-600 mb-1">
                {property.city}, {property.state}
              </p>
              <p className="text-gray-600 mb-2">₹{property.price}</p>
              <div className="flex justify-between items-center mb-3">
                <button
                  className="text-indigo-600 hover:underline cursor-pointer"
                  onClick={() => handleEdit(property._id)}>
                  Edit Property
                </button>

                <button
                  className="text-indigo-600 hover:underline cursor-pointer"
                  onClick={() => handleRemove(property._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProperty;
