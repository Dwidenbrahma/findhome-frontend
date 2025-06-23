import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useHomeContext } from "../HomeContext";
import url from "../../url";
import {
  Home,
  Hotel,
  Building,
  Clock,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Users,
  Landmark,
  Building2,
  MessageCircle,
  Calendar,
  CheckCircle,
} from "lucide-react";

const PropertyRequestForm = () => {
  const { token, loading } = useContext(AuthContext);
  const { id } = useParams();
  const { homeData, isLoading } = useHomeContext();
  const navigate = useNavigate();

  // Initialize all state first before any conditional logic
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({
    propertyId: id,
    propertyTitle: "",
    requestType: "Rent",
    duration: "Short",
    moveInDate: "",
    budget: "",
    specialRequests: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    termsAgreed: false,
  });

  // Handle user ID extraction
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  // Use effect to fetch property data and update form
  useEffect(() => {
    if (!isLoading && homeData) {
      const fetchedProperty = homeData.find((home) => home._id === id);
      if (fetchedProperty) {
        setProperty(fetchedProperty);

        // Update the form state with the property title
        setForm((prevForm) => ({
          ...prevForm,
          propertyTitle: fetchedProperty.title || "Untitled Property",
        }));
      }
    }
  }, [isLoading, homeData, id]);

  // Handle loading states
  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  // Handle authentication redirection
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Handle property not found
  if (!property && !isLoading) {
    return <div>Property not found. Please check the URL and try again.</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}property/book`, {
        propertyId: form.propertyId,
        buyer_id: userId,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        budget: Number(form.budget),
        requestType: form.requestType,
        duration: form.requestType === "Rent" ? form.duration : null,
        moveInDate: form.moveInDate,
        specialRequests: form.specialRequests,
        contactName: form.contactName,
        termsAgreed: form.termsAgreed,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Your request has been sent to the property owner!");
        console.log("Booking successful:", response.data);
        navigate("/user/dashbord");
      } else {
        alert(response.data.message || "Failed to send request.");
        console.error("Booking error:", response.data);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <MessageCircle className="mr-2" /> Request Property
          </h2>
          <p className="mt-2 opacity-90">
            Send your offer to the property owner
          </p>
        </div>

        <div className="bg-gray-50 p-4 border-b">
          <div className="flex items-center">
            <Home className="text-gray-500 mr-2" />
            <span className="font-medium">{form.propertyTitle}</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
              ID: {form.propertyId}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Request Details
            </h3>

            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Request Type
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div
                  onClick={() => setForm({ ...form, requestType: "Rent" })}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                    form.requestType === "Rent"
                      ? "bg-green-100 border-green-500"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}>
                  <Clock className="mr-2 h-5 w-5 text-green-600" />
                  <span>Rent</span>
                </div>
                <div
                  onClick={() => setForm({ ...form, requestType: "Buy" })}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                    form.requestType === "Buy"
                      ? "bg-green-100 border-green-500"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}>
                  <Home className="mr-2 h-5 w-5 text-green-600" />
                  <span>Buy</span>
                </div>
              </div>
            </div>

            {/* Rental Duration - only show for rent requests */}
            {form.requestType === "Rent" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rental Duration
                </label>
                <div className="mt-1 grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setForm({ ...form, duration: "Short" })}
                    className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                      form.duration === "Short"
                        ? "bg-green-100 border-green-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}>
                    <Clock className="mr-2 h-5 w-5 text-green-600" />
                    <span>Short Term</span>
                  </div>
                  <div
                    onClick={() => setForm({ ...form, duration: "Medium" })}
                    className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                      form.duration === "Medium"
                        ? "bg-green-100 border-green-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}>
                    <Clock className="mr-2 h-5 w-5 text-green-600" />
                    <span>Medium Term</span>
                  </div>
                  <div
                    onClick={() => setForm({ ...form, duration: "Long" })}
                    className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                      form.duration === "Long"
                        ? "bg-green-100 border-green-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}>
                    <Clock className="mr-2 h-5 w-5 text-green-600" />
                    <span>Long Term</span>
                  </div>
                </div>
              </div>
            )}

            {/* Move-in Date and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="moveInDate"
                  className="block text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-green-600" />
                  {form.requestType === "Rent"
                    ? "Move-in Date"
                    : "Purchase Date"}
                </label>
                <input
                  type="date"
                  id="moveInDate"
                  name="moveInDate"
                  value={form.moveInDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-green-600" /> Your
                  Budget
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={
                    form.requestType === "Rent"
                      ? "Monthly budget"
                      : "Maximum offer"
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Special Requests
            </h3>

            <div>
              <label
                htmlFor="specialRequests"
                className="block text-sm font-medium text-gray-700">
                Message to Owner
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows="4"
                value={form.specialRequests}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Share any special requests, questions, or offers you'd like to make..."></textarea>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Your Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="termsAgreed"
                name="termsAgreed"
                type="checkbox"
                checked={form.termsAgreed}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="termsAgreed" className="text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:text-green-700">
                  Terms and Conditions
                </a>{" "}
                and acknowledge the{" "}
                <a href="#" className="text-green-600 hover:text-green-700">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!form.termsAgreed}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Send Request
              </div>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default PropertyRequestForm;
