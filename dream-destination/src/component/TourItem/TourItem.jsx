import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useParams, useNavigate } from "react-router-dom";
import { getTourById } from "../../Api/Api";
import axios from "axios";
import {
  SlLocationPin,
  SlCalender,
  SlPeople,
  SlClock,
  SlStar,
} from "react-icons/sl";
import "./TourItem.css";
import Reviews from "../Reviews/Reviews"; // Import the new Reviews component

const TourItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupSize, setGroupSize] = useState(1);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [hasBooked, setHasBooked] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    review: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const stripePromise = loadStripe(
    "pk_test_51QyBa5Jew3pnvwY4unWMn1eUpYpn8wBeh9ic06odV0WVo3tjabyxn7AXeHYmuvb3SsF2Q8HMgbqPNjs1o2PY0AxV00WjlFzK5D"
  );

  // Fetch tour details
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = await getTourById(id);
        setTour(tourData);
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  // Fetch user ID from backend using JWT
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/me", {
          withCredentials: true,
        });

        setUserId(response.data.data._id);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  const handleBooking = async () => {
    let finalUserId = userId;

    if (!finalUserId) {
      try {
        const response = await axios.get("http://localhost:8000/api/users/me", {
          withCredentials: true,
        });
        finalUserId = response.data.data._id;
      } catch (error) {
        setError("You must be logged in to book a tour.");
        return;
      }
    }

    if (!finalUserId) {
      setError("You must be logged in to book a tour.");
      return;
    }

    if (groupSize < 1 || groupSize > (tour?.maxGroupSize || 15)) {
      setError(`Group size must be between 1 and ${tour?.maxGroupSize || 15}`);
      return;
    }

    setError("");

    try {
      // Check if the user has already booked this tour
      const existingBooking = await axios.get(
        `http://localhost:8000/api/bookings/check-booking/${finalUserId}/${id}`,
        { withCredentials: true }
      );

      if (existingBooking.data.alreadyBooked) {
        setError("You have already booked this tour.");
        setHasBooked(true);
        return;
      }

      const isConfirmed = window.confirm(
        "Do you really want to book this tour?"
      );
      if (!isConfirmed) {
        setError("Booking was not successful.");
        return;
      }

      // 1. Create Stripe Checkout session
      const { data } = await axios.post(
        `http://localhost:8000/api/bookings/${id}`,
        {
          user: finalUserId,
          numberOfGuests: groupSize,
        },
        { withCredentials: true }
      );

      console.log("data is .........................", data);

      window.location.href = data.url;
    } catch (err) {
      console.log("Error is.........................", err);
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  // cancel booking
  const handleCancelBooking = async () => {
    if (!userId || !tour || !tour.startDate) {
      setError("Invalid booking or tour details.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const tourStartDate = new Date(tour.startDate).toISOString().split("T")[0];

    if (tourStartDate === today) {
      setError("You cannot cancel a tour on the start date.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/bookings/cancel/${tour._id}`,
        {
          withCredentials: true,
        }
      );

      setHasBooked(false); // Update state immediately
      setError(""); // Clear errors
    } catch (error) {
      setError("Cancellation failed. Please try again.");
    }
  };

  const checkBooking = async () => {
    if (!userId || !id) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/bookings/check-booking/${userId}/${id}`,
        { withCredentials: true }
      );

      console.log("Booking check response:", response.data);
      setHasBooked(response.data.alreadyBooked);
    } catch (error) {
      console.error("Error checking booking status:", error);
      setHasBooked(false);
    }
  };

  // Run checkBooking when userId or id changes
  useEffect(() => {
    if (userId && id) {
      checkBooking();
    }
  }, [userId, id]);

  // Handle review form input changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value,
    });
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess(false);

    if (!review.review.trim()) {
      setReviewError("Please enter your review text");
      return;
    }

    if (review.rating < 1 || review.rating > 5) {
      setReviewError("Rating must be between 1 and 5");
      return;
    }

    try {
      console.log("id is.........................", id);
      await axios.post(
        `http://localhost:8000/api/tours/${id}/reviews`,
        {
          review: review.review,
          rating: review.rating,
        },
        { withCredentials: true }
      );

      // Show success message
      setReviewSuccess(true);

      // Reset the form
      setReview({
        rating: 5,
        review: "",
      });

      // Hide the form after success
      setShowReviewForm(false);

      // Refresh tour data to update ratings
      const tourData = await getTourById(id);
      setTour(tourData);
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError(
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="loading-container">
        <div className="error-text">Tour not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="tour-item">
        <div className="tour-item-img-container">
          <img
            src={`http://localhost:8000/${tour.imageCover}`}
            alt={tour.name}
            className="tour-item-image"
          />
          <div className="image-overlay">
            <h1 className="tour-name">{tour.name}</h1>
            <div className="location-container">
              <SlLocationPin className="icon" />
              <span className="location-text">Tour Location</span>
            </div>
          </div>
        </div>

        <div className="tour-item-info">
          <div className="info-grid">
            <div className="info-item">
              <SlClock className="icon icon-blue" />
              <span>{tour.duration} days</span>
            </div>
            <div className="info-item">
              <SlPeople className="icon icon-blue" />
              <span>Max {tour.maxGroupSize} people</span>
            </div>
            <div className="info-item">
              <SlStar className="icon icon-yellow" />
              <span>
                {tour.ratingAverage} ({tour.ratingQuantity} reviews)
              </span>
            </div>
            <div className="info-item">
              <SlCalender className="icon icon-blue" />
              <span>
                {tour.startDate
                  ? new Date(tour.startDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <p className="tour-item-desc">{tour.description}</p>

          <div className="price-container">
            <div className="tour-item-price">
              ${tour.price}
              <span className="price-suffix">/person</span>
            </div>
            {tour.priceDiscount && (
              <div className="discount">
                Discount: ${tour.priceDiscount} off!
              </div>
            )}
          </div>

          <div className="dates-container">
            <div className="date-item">
              <span className="date-label">Start Date:</span>
              <span>
                {tour.startDate
                  ? new Date(tour.startDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="date-item">
              <span className="date-label">End Date:</span>
              <span>
                {tour.endDate
                  ? new Date(tour.endDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="date-item">
              <span className="date-label">Duration:</span>
              <span>{tour.duration} days</span>
            </div>
          </div>

          <div className="booking-container">
            {hasBooked ? (
              <>
                <p className="already-booked-message">
                  ✅ You have already booked this tour.
                </p>
                <div className="booking-actions">
                  <button
                    className="cancel-button"
                    onClick={handleCancelBooking}
                  >
                    Cancel Booking
                  </button>

                  <button
                    className="review-button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? "Hide Review Form" : "Leave a Review"}
                  </button>
                </div>

                {reviewSuccess && (
                  <p className="review-success-message">
                    ✅ Thank you for your review!
                  </p>
                )}

                {showReviewForm && (
                  <div className="review-form-container">
                    <h3>Share Your Experience</h3>
                    <form onSubmit={handleReviewSubmit} className="review-form">
                      <div className="form-group">
                        <label htmlFor="rating">Rating (1-5):</label>
                        <select
                          id="rating"
                          name="rating"
                          value={review.rating}
                          onChange={handleReviewChange}
                          className="rating-select"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                          <option value="4">⭐⭐⭐⭐ (4)</option>
                          <option value="3">⭐⭐⭐ (3)</option>
                          <option value="2">⭐⭐ (2)</option>
                          <option value="1">⭐ (1)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="review">Your Review:</label>
                        <textarea
                          id="review"
                          name="review"
                          value={review.review}
                          onChange={handleReviewChange}
                          placeholder="Share your experience with this tour..."
                          className="review-textarea"
                          rows="4"
                        ></textarea>
                      </div>

                      {reviewError && (
                        <p className="error-text">{reviewError}</p>
                      )}

                      <button type="submit" className="submit-review-button">
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <label>Enter your Group Size:</label>
                <input
                  type="number"
                  min="1"
                  max={tour?.maxGroupSize || 15}
                  name="numberOfGuests"
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className="group-size-input"
                  placeholder="Enter group size"
                />
                <button className="book-button" onClick={handleBooking}>
                  Book Now
                </button>
              </>
            )}
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </div>

      {/* Add the Reviews component */}
      <Reviews tourId={id} />
    </div>
  );
};

export default TourItem;
