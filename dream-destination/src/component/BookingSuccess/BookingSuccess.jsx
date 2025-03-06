import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingSuccess.css";

const BookingSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get session_id from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get("session_id");

        if (!sessionId) {
          throw new Error("No session ID found in URL");
        }

        // Make API call to verify the payment status
        // Since we're using cookies, we don't need to manually include the token
        // Axios will automatically send cookies with the request when withCredentials is true
        const response = await axios.get(
          `http://localhost:8000/api/bookings/verify-payment/${sessionId}`,
          {
            withCredentials: true, // This tells axios to include cookies in the request
          }
        );

        console.log(
          "Booking response is.......................",
          response.data
        );

        setBooking(response.data.booking);
        setLoading(false);
      } catch (err) {
        console.error("Error verifying payment:", err);

        // Check if error is due to authentication
        if (err.response && err.response.status === 401) {
          // Redirect to login page on auth error
          navigate("/login", {
            state: {
              redirectTo: location.pathname + location.search,
              message:
                "Your session has expired. Please log in again to view your booking.",
            },
          });
          return;
        }

        setError(
          err.message || "An error occurred while verifying your payment"
        );
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  // Rest of the component remains the same as in your original code
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="text-xl font-semibold">Verifying your booking...</h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-red-50 rounded-lg">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your tour has been booked successfully.
          </p>

          {booking && (
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">
                Booking Details:
              </h3>
              <p>
                <span className="font-medium">Tour:</span> {booking.tour.name}
              </p>
              <p>
                <span className="font-medium">Guests:</span>{" "}
                {booking.numberOfGuests}
              </p>
              <p>
                <span className="font-medium">Booking ID:</span> {booking._id}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-green-600 font-medium">
                  {booking.status}
                </span>
              </p>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <Link
              to="/my-bookings"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
