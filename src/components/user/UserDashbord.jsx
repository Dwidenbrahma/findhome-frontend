import { useState, useContext, useEffect } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { AuthContext } from "../AuthContext";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import url from "../../url";

const Review = ({ onSubmit, onClose, houseId, userId }) => {
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}review`,
        {
          house: houseId,
          user: userId,
          comment: reviewText,
          date: new Date().toLocaleDateString(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log(response.data);
    } catch (err) {
      console.log(err + " something error occured");
    }

    if (reviewText.trim()) {
      onSubmit(reviewText);
      setReviewText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}></div>

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Write a Review</h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            onClick={onClose}>
            &times;
          </button>
        </div>

        <textarea
          className="w-full border border-gray-300 rounded p-3 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={reviewText}
          placeholder="Share your experience about this property..."
          onChange={(e) => setReviewText(e.target.value)}></textarea>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={handleSubmit}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

const UserDashbord = () => {
  const [reviewVisibility, setReviewVisibility] = useState([]);
  const { token, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    const tokens = localStorage.getItem("token") || token;
    try {
      const response = await axios.get(`${url}user/dashboard`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });

      setUserData(response.data.user);
      setBookingData(response.data.bookings);
      setReviewVisibility(new Array(response.data.bookings.length).fill(false));
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching dashboard data");
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  if (loading) {
    return null;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (error)
    return <p className="text-red-500 text-center py-4">Error: {error}</p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleReviewSubmit = (reviewText) => {
    console.log("Review submitted:", reviewText);
    handleClose(); // Close the review modal after submission
  };

  const handleClose = () => {
    setReviewVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility.fill(false);
      return newVisibility;
    });
  };

  const toggleReviewVisibility = (index, booking) => {
    // Check if checkout is done (current date is after end date)
    const currentDate = new Date();
    const endDate = new Date(booking.endDate);

    if (currentDate < endDate) {
      alert("You can only write a review after your stay has ended.");
      return;
    }

    setReviewVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Helper function to check if checkout is done
  const isCheckoutDone = (booking) => {
    const currentDate = new Date();
    const endDate = new Date(booking.endDate);
    return currentDate >= endDate;
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel the Booking"
    );
    if (!confirmed) return;
    try {
      const response = await axios.delete(`${url}cancel/booking/${id}`);

      if (response.status === 200) {
        await fetchDashboardData(); // re-fetch updated data
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="relative">
        <Header />
      </header>

      <main className="bg-gray-50 min-h-screen py-8 pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User profile card with logout */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={`${url}${userData?.profileImage}`}
                  alt="user-profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <p className="text-2xl font-bold text-gray-800">
                    {userData?.name}
                  </p>
                  <p className="text-gray-600">{userData?.email}</p>
                  <p className="text-gray-600">{userData?.phone}</p>
                </div>
              </div>

              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4 md:mt-0"
                onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Recent Booking
          </h1>

          <div className="space-y-6">
            {bookingData.length > 0 ? (
              bookingData.map((booking, index) => (
                <div
                  className="bg-white shadow rounded-lg overflow-hidden flex flex-col md:flex-row"
                  key={booking._id}>
                  <img
                    className="w-full md:w-64 h-48 object-cover"
                    src={`${url}${
                      booking.house?.images && booking.house?.images[0]
                        ? booking.house.images[0]
                        : "default-image.jpg"
                    }`}
                    alt="booking"
                  />
                  <div className="p-6 flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {booking.house?.title || "House Title"}
                    </h2>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <span className="text-sm text-gray-500 block">
                        From: {new Date(booking.startDate).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500 block">
                        To: {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mb-4">
                      Total{" "}
                      <span className="font-bold text-blue-600">
                        {new Intl.NumberFormat("hi-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(booking.totalPrice)}{" "}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleReviewVisibility(index, booking)}
                        className={`${
                          isCheckoutDone(booking)
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white font-bold py-2 px-4 rounded transition duration-300`}
                        title={
                          isCheckoutDone(booking)
                            ? "Write a review"
                            : "You can write a review after your stay"
                        }>
                        {reviewVisibility[index]
                          ? "Cancel Review"
                          : "Write Review"}
                      </button>
                      <Link
                        to={`/reserve/${booking._id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 inline-block">
                        Book Again
                      </Link>

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer"
                        onClick={() => handleCancel(booking._id)}>
                        Cancel Booking
                      </button>
                    </div>

                    {!isCheckoutDone(booking) && (
                      <p className="text-sm text-orange-500 mt-2">
                        *You can write a review after your stay ends on{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {reviewVisibility[index] && (
                    <Review
                      onSubmit={handleReviewSubmit}
                      onClose={handleClose}
                      houseId={booking.house}
                      userId={booking.renter}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                No bookings found.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer with logout option */}
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default UserDashbord;
