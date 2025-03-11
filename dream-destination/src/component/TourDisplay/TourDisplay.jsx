import React, { useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { Link } from "react-router-dom";

const TourDisplay = () => {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/tours") // Ensure this is the correct backend route
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tours");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data is ..........", data.tours)
        setTours(data.tours)
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
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
        <p>No tours found.</p>
      )}
    </div>
  );
};

export default TourDisplay;
