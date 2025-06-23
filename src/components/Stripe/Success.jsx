import Header from "../header/Header";
import Footer from "../footer/Footer";

const Success = () => {
  return (
    <>
      {" "}
      <Header />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto mt-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your booking. Your payment has been processed
            successfully and your booking is now confirmed.
          </p>
          <div className="bg-gray-50 p-4 rounded mb-6">
            <div className="text-left mb-3">
              <p className="text-gray-700">
                <strong>Check-in:</strong>{" "}
                {new Date(bookingDetails.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Check-out:</strong>{" "}
                {new Date(bookingDetails.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Guests:</strong> {bookingDetails.guestCount}
              </p>
              <p className="text-gray-700">
                <strong>Total Paid:</strong> ${bookingDetails.price.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate("/user/dashbord")}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
              View My Bookings
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Success;
