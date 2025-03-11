import React, { useEffect, useState, useRef } from "react";
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
import Reviews from "../Reviews/Reviews";
// Import only Leaflet, not react-leaflet
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for tour and hotel
const tourIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  className: "tour-marker",
});

const hotelIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  className: "hotel-marker",
});

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

  // New state for tour and hotel locations
  const [tourLocation, setTourLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const [hotelLocation, setHotelLocation] = useState({ lat: 37.7833, lng: -122.4167 }); // Default nearby
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapZoom, setMapZoom] = useState(13);

  // Create a ref for the map container div
  const mapRef = useRef(null);
  // Create a ref to store the map instance
  const leafletMapRef = useRef(null);

  const stripePromise = loadStripe(
    "pk_test_51QyBa5Jew3pnvwY4unWMn1eUpYpn8wBeh9ic06odV0WVo3tjabyxn7AXeHYmuvb3SsF2Q8HMgbqPNjs1o2PY0AxV00WjlFzK5D"
  );

  // Fetch tour details
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = await getTourById(id);
        setTour(tourData);

        // Check if tour has location coordinates
        if (tourData && tourData.location && tourData.location.coordinates) {
          const [lng, lat] = tourData.location.coordinates;
          const newTourLocation = { lat, lng };
          setTourLocation(newTourLocation);

          // Set map center between tour and hotel if both have coordinates
          if (tourData.hotel && tourData.hotel.location && tourData.hotel.location.coordinates) {
            const [hotelLng, hotelLat] = tourData.hotel.location.coordinates;
            const newHotelLocation = { lat: hotelLat, lng: hotelLng };
            setHotelLocation(newHotelLocation);

            // Center the map between tour and hotel locations
            setMapCenter({
              lat: (newTourLocation.lat + newHotelLocation.lat) / 2,
              lng: (newTourLocation.lng + newHotelLocation.lng) / 2
            });

            // Adjust zoom level based on distance between points
            // This is a simple approach - you might want a more sophisticated calculation
            const latDiff = Math.abs(newTourLocation.lat - newHotelLocation.lat);
            const lngDiff = Math.abs(newTourLocation.lng - newHotelLocation.lng);
            const maxDiff = Math.max(latDiff, lngDiff);

            if (maxDiff > 0.1) setMapZoom(10);
            else if (maxDiff > 0.05) setMapZoom(11);
            else if (maxDiff > 0.01) setMapZoom(12);
            else setMapZoom(13);
          } else {
            // If only tour location is available, center on it
            setMapCenter(newTourLocation);

            // If hotel location is not provided, set it to a default nearby location
            // In a real app, you might want to handle this differently
            setHotelLocation({
              lat: lat + 0.01,
              lng: lng + 0.01
            });
          }
        } else {
          // Fallback to sample locations if tour doesn't have coordinates
          console.log("No coordinates found in tour data, using defaults");
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  // Initialize Leaflet map when the component mounts or when mapCenter changes
  useEffect(() => {
    // If the map is already initialized, clean it up first
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Check if the map container exists
    if (mapRef.current && !leafletMapRef.current) {
      // Initialize the map
      leafletMapRef.current = L.map(mapRef.current).setView(
        [mapCenter.lat, mapCenter.lng],
        mapZoom
      );

      // Add the tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMapRef.current);

      // Add tour location marker
      const tourMarker = L.marker([tourLocation.lat, tourLocation.lng], {
        icon: tourIcon,
      }).addTo(leafletMapRef.current);

      // Add popup to tour marker
      tourMarker.bindPopup(
        `<strong>${tour?.name || 'Tour'}</strong><br />
        ${tour?.location?.description || 'Tour location'}`
      );

      // Add hotel location marker
      const hotelMarker = L.marker([hotelLocation.lat, hotelLocation.lng], {
        icon: hotelIcon,
      }).addTo(leafletMapRef.current);

      // Add popup to hotel marker
      hotelMarker.bindPopup(
        `<strong>${tour?.hotel?.name || 'Accommodation'}</strong><br />
        ${tour?.hotel?.location?.description || 'Hotel location'}`
      );

      // Removed the polyline between tour and hotel
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapCenter, tour, tourLocation, hotelLocation, mapZoom]);

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
      {/* Full-width tour image */}
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
            <span className="location-text">
              {tour.location ? tour.location.description : "Tour Location"}
            </span>
          </div>
        </div>
      </div>

      <div className="tour-item">
        {/* Two-column layout for tour info */}
        <div className="tour-content-wrapper">
          {/* Left column: Tour details */}
          <div className="tour-details-column">
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
          </div>

          {/* Right column: Map and booking */}
          <div className="tour-booking-column">
            {/* Map Section */}
            <div className="map-container">
              <h3>Tour and Hotel Locations</h3>
              <div
                ref={mapRef}
                className="map-wrapper"
                style={{ height: "300px", marginBottom: "20px" }}
              ></div>
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-marker tour-marker"></div>
                  <span>Tour Location</span>
                </div>
                <div className="legend-item">
                  <div className="legend-marker hotel-marker"></div>
                  <span>Hotel Location</span>
                </div>
              </div>
            </div>

            {/* Booking section */}
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
                  <h3>Ready to Book?</h3>
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
      </div>

      {/* Add the Reviews component */}
      <Reviews tourId={id} />
    </div>
  );
};

export default TourItem;