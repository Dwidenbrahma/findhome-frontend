import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Success from "./Success";
import url from "../../url";
import LoadingBooking from "./LoadingBooking";
import * as jwtDecode from "jwt-decode";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#5469d4",
      color: "#1a1f36",
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      iconColor: "#ef4444",
      color: "#ef4444",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
    },
  });

  // Load booking details from localStorage
  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      setBookingDetails(JSON.parse(pendingBooking));
    } else {
      navigate("/"); // fallback route if booking data missing
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBillingDetails({
        ...billingDetails,
        [parent]: {
          ...billingDetails[parent],
          [child]: value,
        },
      });
    } else {
      setBillingDetails({
        ...billingDetails,
        [name]: value,
      });
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Check if all required fields are filled
    const { name, address } = billingDetails;
    if (
      !name ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postal_code
    ) {
      setError("All billing fields are required.");
      return false;
    }

    // Validate postal code format (basic validation)
    const postalRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    if (!postalRegex.test(address.postal_code)) {
      setError("Please enter a valid postal code (e.g., 12345 or 12345-6789).");
      return false;
    }

    return true;
  };

  const saveBookingToDatabase = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${url}reserve/${bookingDetails.propertyId}`,
        {
          ...bookingDetails,
          paid: true,
          paymentIntentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (err) {
      console.error("Error saving booking:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if (!stripe || !elements || !bookingDetails) {
      setError("Payment processing unavailable. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to complete this booking.");
        setLoading(false);
        return;
      }

      let userId = "";
      let userEmail = "";

      try {
        const decoded = jwtDecode(token);
        userId = decoded.id || decoded._id || "";
        userEmail = decoded.email || "";
      } catch (jwtError) {
        setError("Invalid session. Please log in again.");
        setLoading(false);
        return;
      }

      const amountInCents = Math.round(bookingDetails.price * 100);

      // Create payment intent
      const { data } = await axios.post(`${url}payment`, {
        amount: amountInCents,
        property_id: bookingDetails.propertyId,
        user_id: userId,
        user_email: userEmail,
      });

      // Ensure the client secret is available
      if (!data?.clientSecret) {
        setError("Failed to initiate payment. Please try again later.");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          },
        });

      if (confirmError) {
        // Handle specific card errors
        if (confirmError.type === "card_error") {
          setError(`Card error: ${confirmError.message}`);
        } else {
          setError(confirmError.message);
        }
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        try {
          await saveBookingToDatabase(paymentIntent.id);
          localStorage.removeItem("pendingBooking");
          setSuccess(true);
        } catch (saveError) {
          setError(
            "Payment succeeded but booking could not be saved. Please contact support."
          );
          console.error("Booking save error:", saveError);
        }
      } else {
        setError(`Payment status: ${paymentIntent.status}. Please try again.`);
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment processing error:", err);

      // More specific error messages based on error types
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 400) {
        setError(
          err.response.data.message || "Please check your payment details."
        );
      } else {
        setError(
          "Payment processing failed. Please try again or contact support."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return <LoadingBooking />;
  if (success) return <Success />;

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h1 className="text-white font-bold text-xl">
                Complete Your Booking
              </h1>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold mb-2">Booking Summary</h2>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium">
                  {new Date(bookingDetails.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium">
                  {new Date(bookingDetails.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Nights</span>
                <span className="font-medium">{bookingDetails.nights}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium">{bookingDetails.guestCount}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Price per night</span>
                <span className="font-medium">
                  ${bookingDetails.pricePerNight.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="text-xl font-bold">
                  ${bookingDetails.price.toFixed(2)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={billingDetails.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={billingDetails.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.line1"
                    value={billingDetails.address.line1}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={billingDetails.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={billingDetails.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postal_code"
                      value={billingDetails.address.postal_code}
                      onChange={handleChange}
                      placeholder="12345"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="US">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Information
                  </label>
                  <div className="border rounded-md p-4">
                    <CardElement
                      options={CARD_OPTIONS}
                      onChange={handleCardChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Test card: 4242 4242 4242 4242
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!stripe || loading || !cardComplete}
                  className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
                    !stripe || loading || !cardComplete
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}>
                  {loading
                    ? "Processing..."
                    : `Pay $${bookingDetails?.price.toFixed(2) || "0.00"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutForm;
