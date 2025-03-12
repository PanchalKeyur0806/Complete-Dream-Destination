import React, { useState, useEffect } from "react";
import { SlLocationPin } from "react-icons/sl";
import { Link, useLocation } from "react-router-dom";
import "./TourDisplay.css";

const TourDisplay = ({ tours: propTours = null }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Actual search query to send to API
  const location = useLocation();

  // Determine if this is a standalone page or being used as a component
  const isStandalonePage = location.pathname === "/tour";

  useEffect(() => {
    // If tours are provided as props and we're not on the standalone page, use them
    if (propTours !== null && !isStandalonePage) {
      setTours(propTours);
      setLoading(false);
      return;
    }

    // Otherwise fetch tours (when used as a standalone page)
    if (isStandalonePage || propTours === null) {
      fetchTours(searchQuery);
    }
  }, [propTours, isStandalonePage, searchQuery]); // Using searchQuery instead of searchTerm

  const fetchTours = (search = "") => {
    setLoading(true);

    // Build the URL based on whether a search term exists
    const url = search
      ? `http://localhost:8000/api/tours?search=${encodeURIComponent(search)}`
      : "http://localhost:8000/api/tours";

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tours");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched tours:", data.tours);
        if (Array.isArray(data.tours)) {
          setTours(data.tours);
        } else {
          setTours([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tours:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission on key press (Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchTerm);
    }
  };

  // Handle search on input blur (when user clicks away)
  const handleBlur = () => {
    setSearchQuery(searchTerm);
  };

  if (loading) return <div className="loading">Loading tours...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="tour-display-container">
      {/* Only show search and title when on the standalone tour page */}
      {isStandalonePage && (
        <div className="tours-header container">
          <h2 className="tours-title">Explore Our Tours</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tours by name..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
              className="search-input"
            />
          </div>
        </div>
      )}

      <div className="travel-list container grid gap-5">
        {tours.length > 0 ? (
          tours.map(({ _id, imageCover, name, price }, index) => (
            <div key={`${_id}-${index}`} className="destination">
              <div className="card">
                <img
                  src={`http://localhost:8000/${imageCover}`}
                  className="imageDiv"
                  alt={name || "Tour destination"}
                />
                <div className="card-body">
                  <span className="content d-flex gap-1">
                    <SlLocationPin id="locationIcon" className="icon mt-1" />
                    <span className="name">{name}</span>
                  </span>
                  <div className="fees d-flex justify-content-between mt-2">
                    <div className="price" id="locationIcon">
                      <p>₹{price} / per month</p>
                    </div>
                    <Link to={`/tour/${_id}`}>
                      <button className="btn btn Btn">Book Now</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-tours">No tours found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default TourDisplay;