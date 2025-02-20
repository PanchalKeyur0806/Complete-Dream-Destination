import React, { useEffect, useState } from "react";
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

const TourItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupSize, setGroupSize] = useState(1);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

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
        finalUserId = response.data._id; // Ensure correct data structure
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
      const existingBooking = await axios.get(
        `http://localhost:8000/api/bookings/check-booking/${finalUserId}/${id}`, // Pass both as params
        {
          withCredentials: true,
        }
      );

      console.log(
        ".................................................",
        existingBooking
      );

      if (existingBooking.data.alreadyBooked) {
        setError("You have already booked this tour.");
        return;
      }

      // **Step 2: If not booked, proceed with booking**
      await axios.post(
        `http://localhost:8000/api/bookings/${id}`,
        {
          user: finalUserId,
          numberOfGuests: groupSize,
        },
        { withCredentials: true }
      );

      navigate("/booking-success");
    } catch (err) {
      setError("Booking failed. Please try again.");
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
            {error && <p className="error-text">{error}</p>}
            <button className="book-button" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourItem;
