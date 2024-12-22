import { useState, useContext, useEffect } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import user from "./UserDashbord.module.css";
import { AuthContext } from "../AuthContext";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import url from "../../url";

const Review = ({ onSubmit, onClose }) => {
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    if (reviewText.trim()) {
      onSubmit(reviewText); // Pass review text to the parent component
      setReviewText(""); // Clear the textarea after submission
    }
  };

  return (
    <div className={user.modalOverlay}>
      <div className={user.modal}>
        <div className={user.reviewTop}>
          <h3>Write a Review</h3>
          <button className={user.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <textarea
          className={user.textarea}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}></textarea>
        <button className={user.btn} onClick={handleSubmit}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

const UserDashbord = () => {
  const [reviewVisibility, setReviewVisibility] = useState([]); // State to manage visibility of reviews
  const { token, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashbordData = async () => {
      const tokens = localStorage.getItem("token") || token; // Get token from context or localStorage if context is not available
      try {
        const response = await axios.get(`${url}user/dashboard`, {
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        });

        setUserData(response.data.user);
        setBookingData(response.data.bookings);

        // Initialize the reviewVisibility state for each booking (false by default)
        setReviewVisibility(
          new Array(response.data.bookings.length).fill(false)
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching dashboard data"
        );
      }
    };

    if (token) fetchDashbordData();
  }, [token]);

  if (loading) {
    return null;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (error) return <p>Error: {error}</p>;

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    window.location.href = "/login"; // Redirect to login page
  };

  const handleReviewSubmit = (reviewText) => {
    console.log("Review submitted:", reviewText); // Handle the review submission (e.g., send it to the backend)
    // Here you can send the review to the backend
  };
  const handleClose = () => {
    setReviewVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility.fill(false); // Close all open review modals
      return newVisibility;
    });
  };

  const toggleReviewVisibility = (index) => {
    setReviewVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index]; // Toggle visibility of the review popup
      return newVisibility;
    });
  };

  return (
    <>
      <header>
        <Header />
        <button className={user.bt} onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className={user.container}>
          <div className={user.profile}>
            <img src={`${url}${userData?.profileImage}`} alt="user-profile" />
            <div className={user.inside}>
              <p className={user.p3}>{userData?.name}</p>
              <p className={user.p2}>{userData?.email}</p>
              <p className={user.p2}>{userData?.phone}</p>
            </div>
          </div>
          <h1>Recent Booking</h1>
          <div className={user.recent}>
            {bookingData.length > 0 ? (
              bookingData.map((booking, index) => (
                <div className={user.item} key={booking._id}>
                  <img
                    className={user.img}
                    src={`${url}${
                      booking.house?.images && booking.house?.images[0]
                        ? booking.house.images[0]
                        : "default-image.jpg"
                    }`}
                    alt="booking"
                  />
                  <div className={user.des}>
                    <h2>{booking.house?.title || "House Title"}</h2>
                    <span className={user.span}>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                    <p className={user.p}>
                      Total{" "}
                      <span className={user.span2}>
                        {new Intl.NumberFormat("hi-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(booking.totalPrice)}{" "}
                      </span>
                    </p>
                    <button className={user.btn}>Download Invoice</button>
                    <button
                      onClick={() => toggleReviewVisibility(index)}
                      className={user.btn}>
                      {reviewVisibility[index]
                        ? "Cancel Review"
                        : "Write Review"}
                    </button>
                    <button className={user.btn}>
                      <Link
                        className={user.link}
                        to={`/reserve/${booking._id}`}>
                        Book Again
                      </Link>
                    </button>
                  </div>
                  {reviewVisibility[index] && (
                    <Review
                      onSubmit={handleReviewSubmit}
                      onClose={handleClose}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default UserDashbord;
