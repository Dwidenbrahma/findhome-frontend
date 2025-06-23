import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import url from "../../url";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const [price, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(1);

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    guestCount: 1,
    specialRequests: "",
    guests: [{ name: "", age: "" }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        const response = await axios.get(`${url}info/${id}`);
        setTotalPrice(response.data.price);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHomeInfo();
  }, [id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
  }, [formData.startDate, formData.endDate]);

  const today = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValidationError("");

    if (name === "guestCount") {
      const count = parseInt(value, 10);
      const updatedGuests = Array.from(
        { length: count },
        (_, i) => formData.guests[i] || { name: "", age: "" }
      );
      setFormData({ ...formData, guestCount: count, guests: updatedGuests });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGuestChange = (index, field, value) => {
    setValidationError("");
    const updatedGuests = [...formData.guests];
    updatedGuests[index][field] = value;
    setFormData({ ...formData, guests: updatedGuests });
  };

  const handleStartDateChange = (date) => {
    setValidationError("");
    setFormData({
      ...formData,
      startDate: date,
      endDate:
        formData.endDate && date > formData.endDate ? null : formData.endDate,
    });
  };

  const validateForm = () => {
    if (!formData.startDate || !formData.endDate) {
      setValidationError("Please select check-in and check-out dates.");
      return false;
    }

    for (let i = 0; i < formData.guests.length; i++) {
      const guest = formData.guests[i];
      if (!guest.name || !guest.age) {
        setValidationError(
          `Please complete all information for Guest ${i + 1}.`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        house: id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guests: formData.guests,
        guestCount: formData.guestCount,
        totalPrice: price * nights,
        SpecialRequest: formData.specialRequests || "",
        status: "Pending",
      };

      const response = await axios.post(`${url}reserve/${id}`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem(
          "bookingConfirmation",
          JSON.stringify(response.data)
        );
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred during booking"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = price * nights;

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-8 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Hotel Booking
          </h2>

          {(message || validationError) && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } text-sm font-medium`}>
              {validationError || message}
            </div>
          )}

          {/* Booking Details */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={handleStartDateChange}
                  minDate={today}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select check-in date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) =>
                    setFormData({ ...formData, endDate: date })
                  }
                  minDate={formData.startDate || today}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select check-out date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.startDate}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium text-gray-700">
                Number of Guests <span className="text-red-500">*</span>
              </label>
              <select
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} {i === 0 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Guest Information <span className="text-red-500">*</span>
            </h3>
            {formData.guests.map((guest, index) => (
              <div
                key={index}
                className="border p-5 rounded-lg bg-white mb-4 shadow-sm">
                <h4 className="font-semibold mb-3 text-blue-700">
                  Guest {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) =>
                        handleGuestChange(index, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Guest Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={guest.age}
                      onChange={(e) =>
                        handleGuestChange(index, "age", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Guest Age"
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Request */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Any special requests or preferences?"></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Processing..." : "Submit Booking"}
            </button>
          </div>

          {/* Booking Summary */}
          <div className="text-center mt-4">
            <div className="text-gray-800 font-medium">Booking Summary</div>
            <div className="text-gray-600 text-sm mt-1">
              {nights} {nights === 1 ? "night" : "nights"} at ${price}/night
            </div>
            <div className="text-xl font-bold text-blue-600 mt-2">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>

          <div className="text-center text-red-500 text-xs mt-2">
            * Required fields
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Form;
