import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import url from "../../url.jsx";
import Header from "../header/Header.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}forgot-password`, {
        email,
      });
      setMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Forgot Password
          </h2>

          {message && (
            <p className="text-green-600 text-center mb-4">{message}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
              Send Reset Link
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
