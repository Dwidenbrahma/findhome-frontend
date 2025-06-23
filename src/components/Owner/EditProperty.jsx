import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import url from "../../url";
import { OwnerAuthContext } from "../OwnerContextAuth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Header from "./HeaderForOwner";
import Footer from "./FooterForOwner";
import PropertyStats from "./PropertyStats";
import LocationInfo from "./LocationInfo";

const EditProperty = () => {
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const { id } = useParams();
  const { ownerToken } = useContext(OwnerAuthContext);

  const [property, setProperty] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}info/${id}`, {
          headers: { Authorization: `Bearer ${ownerToken}` },
        });
        setProperty(res.data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        showNotification("Failed to load property details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, ownerToken]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setFieldValue(property[field]);
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValue("");
  };

  const handleSave = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to update "${editingField}"?`
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      await axios.patch(
        `${url}owner/update/${id}`,
        { [editingField]: fieldValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ownerToken}`,
          },
        }
      );

      setProperty({ ...property, [editingField]: fieldValue });
      setEditingField(null);
      setFieldValue("");
      showNotification("Property updated successfully!");
    } catch (error) {
      console.error("Failed to update property:", error);
      showNotification("Failed to update property", "error");
    } finally {
      setSaving(false);
    }
  };

  const propertyFields = [
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Location", key: "location" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Country", key: "country" },
    { label: "Type", key: "type" },
    { label: "Price", key: "price" },
    { label: "Bedrooms", key: "bedrooms" },
    { label: "Bathrooms", key: "bathrooms" },
    { label: "Guests", key: "guests" },
    { label: "Availability", key: "availability" },
  ];

  const renderEditableField = (label, fieldKey) => {
    const isEditing = editingField === fieldKey;
    const isDescription = fieldKey === "description";
    const isTitle = fieldKey === "title";

    return (
      <div
        className={`mb-6 transition-all duration-200 ${
          isEditing ? "bg-blue-50 p-4 rounded-lg" : ""
        }`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        {isEditing ? (
          <div className="flex flex-col gap-3">
            {fieldKey === "availability" ? (
              <select
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm">
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            ) : isDescription ? (
              <textarea
                rows={5}
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md w-full resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className={`border border-gray-300 px-4 py-2 rounded-md w-full ${
                  isTitle ? "text-lg font-semibold" : ""
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm`}
                autoFocus
              />
            )}

            <div className="flex gap-2">
              <button
                className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition shadow-sm flex items-center ${
                  saving ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={handleSave}
                disabled={saving}>
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </button>
              <button
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-50 shadow-sm"
                onClick={handleCancel}
                disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 group hover:border-indigo-300 transition-colors">
            <span
              className={`text-gray-800 py-1 ${
                isTitle ? "text-lg font-semibold" : ""
              }`}>
              {property[fieldKey] || "—"}
            </span>
            <button
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white hover:bg-indigo-50 px-3 py-1 rounded-md"
              onClick={() => handleEditClick(fieldKey)}>
              Edit
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading property details...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {propertyFields.map((field) => (
              <div
                key={field.key}
                className={field.key === "description" ? "md:col-span-2" : ""}>
                {renderEditableField(field.label, field.key)}
              </div>
            ))}
          </div>
        );
      case "location":
        return <LocationInfo property={property} />;
      default:
        return null;
    }
  };
  const handleFileChange = (propertyId, event) => {
    const files = event.target.files;
    setSelectedFiles({
      ...selectedFiles,
      [propertyId]: files,
    });
  };

  const handleUpload = async (id) => {
    if (!selectedFiles[id] || selectedFiles[id].length === 0) {
      alert("No files selected!");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles[id]).forEach((file) => {
      formData.append("panoramic", file);
    });

    try {
      setUploadingId(id);
      await axios.patch(`${url}owner/panoramic/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${ownerToken}`,
        },
      });
      alert("Upload successful!");
      setSelectedFiles((prev) => ({ ...prev, [id]: null }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {property.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {property.location}, {property.city}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active Listing
              </span>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
            {property.images && property.images.length > 0 ? (
              <div className="h-80 sm:h-[400px] md:h-[500px]">
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  showStatus={false}
                  autoPlay
                  interval={3000}
                  className="rounded-t-xl">
                  {property.images.map((img, index) => (
                    <div key={index}>
                      <img
                        src={`${url}${img}`}
                        alt={`Property ${index}`}
                        className="object-cover w-full h-80 sm:h-[400px] md:h-[500px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : (
              <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                No images available
              </div>
            )}
          </div>

          <PropertyStats property={property} />

          <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  Property Details
                </button>
                <button
                  onClick={() => setActiveTab("location")}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === "location"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  Location
                </button>
              </nav>
            </div>
            <div className="p-8">{renderTabContent()}</div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">
                Upload Panoramic Room Views
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(property._id, e)}
                className="mb-2"
              />
              <button
                disabled={uploadingId === property._id}
                onClick={() => handleUpload(property._id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                {uploadingId === property._id ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProperty;
