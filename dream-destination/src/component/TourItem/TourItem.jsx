// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getTourById } from "../../Api/Api";

// const TourItem = () => {
//   const { id } = useParams();
//   const [tour, setTour] = useState(null);

//   useEffect(() => {
//     const fetchTour = async () => {
//       const tourData = await getTourById(id);
//       setTour(tourData);
//     };

//     fetchTour();
//   }, [id]);

//   if (!tour) return <p>Loading...</p>;

//   return (
//     <div className="tour-details container">
//       <h1>{tour.name}</h1>
//       <img src={`http://localhost:8000/${tour.imageCover}`} alt={tour.name} />
//       <p>Price: ${tour.price} per month</p>
//       <p>{tour.description}</p>
//     </div>
//   );
// };

// export default TourItem;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTourById } from "../../Api/Api";
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
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

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
              <span>{new Date(tour.startDate).toLocaleDateString()}</span>
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
              <span>{new Date(tour.startDate).toLocaleDateString()}</span>
            </div>
            <div className="date-item">
              <span className="date-label">End Date:</span>
              <span>{new Date(tour.endDate).toLocaleDateString()}</span>
            </div>
            <div className="date-item">
              <span className="date-label">Duration:</span>
              <span>{tour.duration} days</span>
            </div>
          </div>

          <button className="book-button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default TourItem;
