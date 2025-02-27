import React, { useEffect, useState } from "react";
import axios from "axios";
import { SlStar } from "react-icons/sl";
import "./Reviews.css";

const Reviews = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Note: Fixed the typo in 'reviews' from your API endpoint
        const response = await axios.get(
          `http://localhost:8000/api/tours/${tourId}/reviews`,
          {
            withCredentials: true,
          }
        );
        setReviews(response.data.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchReviews();
    }
  }, [tourId]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <SlStar key={i} className={i < rating ? "star filled" : "star empty"} />
      );
    }
    return stars;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Guest Reviews</h2>

      {error && <div className="reviews-error">{error}</div>}

      {reviews.length === 0 && !error ? (
        <div className="no-reviews">
          No reviews yet for this tour. Be the first to leave a review!
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="review-user">
                  {review.user?.name || "Anonymous User"}
                </div>
                <div className="review-date">
                  {formatDate(review.createdAt)}
                </div>
              </div>

              <div className="review-rating">
                {renderStars(review.rating)}
                <span className="rating-number">({review.rating})</span>
              </div>

              <div className="review-content">{review.review}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
