import Footer from "../footer/Footer.jsx";
import Header from "../header/Header.jsx";
import { Link } from "react-router-dom";
import ImgGallery from "./ImgGallery";
import { useHomeContext } from "../HomeContext.jsx";
// import { FaBed, FaWifi, FaCity } from "react-icons/fa6";
// import { FaCoffee, FaStar, FaShieldAlt } from "react-icons/fa";
import {
  FaSubway,
  FaBus,
  FaTaxi,
  FaRoute,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import url from "../../url.jsx";

import {
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaUtensils,
  FaTv,
  FaStar,
  FaQuestionCircle,
  FaCity,
  FaBed,
} from "react-icons/fa";
import { MdPets } from "react-icons/md";
const DefaultIcon = FaQuestionCircle;
const amenityIcons = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  breakfast: FaUtensils,
  tv: FaTv,
  pets: MdPets,
  // Add more as needed
};

const Info = () => {
  //All the existing code for states and functions remains the same
  const [homeData, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id, type } = useParams();

  // Dummy crime data based on location

  // Get dummy transportation data based on location

  useEffect(() => {
    const fetchHomes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}info/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching homes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomes();
  }, [id]);

  const getTransportData = (location) => {
    // Generate specific lat/lng based on the location name hash
    const baseLat = homeData?.coordinates?.lat || 0; // Use fallback if lat is undefined
    const baseLng = homeData?.coordinates?.lng || 0; // Use fallback if lng is undefined

    // Get transport data and ensure distance is a valid number
    const airport = homeData?.transportInfo?.[0]?.airport || { distance: 0 }; // Fallback for missing airport data
    const bustop = homeData?.transportInfo?.[0]?.bustop || { distance: 0 }; // Fallback for missing bustop data
    const trainStation = homeData?.transportInfo?.[0]?.trainStation || {
      distance: 0,
    }; // Fallback for missing train station data

    // Convert distance to a valid number (if it's a string or other type)
    const airportDistance = isNaN(parseFloat(airport.distance))
      ? 0
      : parseFloat(airport.distance);
    const bustopDistance = isNaN(parseFloat(bustop.distance))
      ? 0
      : parseFloat(bustop.distance);
    const trainStationDistance = isNaN(parseFloat(trainStation.distance))
      ? 0
      : parseFloat(trainStation.distance);

    return {
      location: {
        lat: baseLat,
        lng: baseLng,
        address: `${location}, India`,
      },
      publicTransport: [
        {
          type: "Airport",
          name: `${location} Airport`,
          distance: airportDistance,
        },
        {
          type: "Bus",
          name: `${location} Bus Stop`,
          distance: bustopDistance,
        },
        {
          type: "Train Station",
          name: `${location} Train Station`,
          distance: trainStationDistance,
        },
      ],
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-600 text-xl">Property not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get dummy crime data for the location

  // Get dummy transport data for the location
  const transportData = getTransportData(
    homeData.location || "Default Location"
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Image Gallery */}
        <div className="mb-8">
          <ImgGallery src={homeData.images} />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Title and Book Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {homeData.title}
            </h1>

            <Link to={`/user/panoramic/${id}`}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                Virtual tour
              </button>
            </Link>
            {["hotel", "buy", "rent"].includes(type.toLowerCase()) ? (
              <Link to={`/reserve/${id}`}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                  Book Now
                </button>
              </Link>
            ) : (
              <Link to={`/reserve/property/${id}`}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                  Book Now
                </button>
              </Link>
            )}
          </div>

          {/* Location & Capacity Info */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {homeData.location}, India
              </div>
              <div className="ml-3 flex items-center text-yellow-500">
                <FaStar />
                <span className="ml-1 text-gray-700">{homeData.rating}/5</span>
              </div>
            </div>
            <p className="text-gray-600">
              {homeData.guests} guests • {homeData.bedrooms} bedrooms •{" "}
              {homeData.bathrooms} bathrooms
            </p>

            <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
              <p className="text-indigo-900 font-medium mb-2">Price:</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat("hi-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(homeData.price)}
                <span className="text-sm text-gray-500 font-normal ml-1">
                  night
                </span>
              </p>
            </div>
          </div>

          {/* TRANSPORTATION SECTION - Modified to use OpenStreetMap */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaRoute className="mr-2 text-indigo-600" />
              Transportation & Location
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Transportation Info */}
                <div className="flex-1">
                  <div className="border-b border-gray-200">
                    {/* Removed the tab navigation */}
                  </div>

                  <div className="mt-4">
                    {/* Directly displaying Public Transport */}
                    <div className="space-y-4">
                      {transportData.publicTransport.map((transit, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center mb-2">
                            {transit.type === "Airport" ? (
                              <FaSubway className="text-indigo-600 mr-2" />
                            ) : (
                              <FaBus className="text-indigo-600 mr-2" />
                            )}
                            <h3 className="font-medium text-gray-800">
                              {transit.name}
                            </h3>
                          </div>
                          <div className="ml-6 space-y-1 text-sm">
                            <p>
                              <span className="text-gray-500">Distance:</span>{" "}
                              {transit.distance} km
                            </p>
                            <p>
                              <span className="text-gray-500">
                                Travel Time:
                              </span>{" "}
                              {transit.travelTime} min
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 mt-2">
                        <p>
                          Public transport is the most convenient way to explore
                          the city from this location.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OpenStreetMap integration - replaced Google Maps */}
                <div className="flex-1 min-h-64 border rounded-lg overflow-hidden shadow-sm relative">
                  <div className="bg-indigo-600 text-white p-3 flex items-center">
                    <FaMapMarkedAlt className="mr-2" />
                    <h3 className="font-medium">Location Map</h3>
                  </div>

                  {/* OpenStreetMap iframe */}
                  <div className="h-64 bg-gray-100 relative">
                    <iframe
                      title="Property Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        transportData.location.lng - 0.01
                      }%2C${transportData.location.lat - 0.01}%2C${
                        transportData.location.lng + 0.01
                      }%2C${
                        transportData.location.lat + 0.01
                      }&layer=mapnik&marker=${transportData.location.lat}%2C${
                        transportData.location.lng
                      }`}
                      allowFullScreen></iframe>

                    {/* Link to the full OpenStreetMap */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center text-xs">
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${transportData.location.lat}&mlon=${transportData.location.lng}#map=16/${transportData.location.lat}/${transportData.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline">
                        View larger map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END OF TRANSPORTATION SECTION */}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              About this place
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {homeData.description ||
                "Experience comfort and luxury in this beautiful property located in the heart of the city."}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What this place offers
            </h2>
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <FaBed className="text-indigo-600" size={20} />
                </div>
                <p className="text-gray-700">Wonderful sleep</p>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <FaWifi className="text-indigo-600" size={20} />
                </div>
                <p className="text-gray-700">Wifi</p>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <FaCoffee className="text-indigo-600" size={20} />
                </div>
                <p className="text-gray-700">Coffee</p>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <FaCity className="text-indigo-600" size={20} />
                </div>
                <p className="text-gray-700">Beautiful City View</p>
              </div>
            </div> */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(homeData.amenities[0]?.split(",") || []).map(
                (amenityRaw, index) => {
                  const amenity = amenityRaw.trim().toLowerCase();
                  const Icon = amenityIcons[amenity] || DefaultIcon; // Get the corresponding icon
                  return (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-indigo-100 p-3 rounded-full mr-3">
                        {Icon ? (
                          <Icon className="text-indigo-600 text-xl" />
                        ) : (
                          <span className="text-indigo-600 text-sm font-bold">
                            {amenity.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 capitalize">{amenity}</p>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            {homeData.reviews && homeData.reviews.length > 0 ? (
              <div className="space-y-6">
                {homeData.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-4 flex-shrink-0">
                        <img
                          src={
                            review.user?.profileImage
                              ? `${url}${review.user.profileImage}`
                              : `${url}default-profile.png`
                          }
                          alt="User"
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center mb-1">
                          <p className="font-medium text-gray-800 mr-2">
                            {review.user?.name || "Guest"}
                          </p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, idx) => (
                              <FaStar key={idx} size={14} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No reviews yet. Be the first to leave a review!
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Info;
