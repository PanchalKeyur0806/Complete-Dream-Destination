import React from "react";
import { SlLocationPin } from "react-icons/sl";
import { Link } from "react-router-dom";

const TourDisplay = ({ tours = [] }) => {
  // Ensure tours is always an array
  if (!Array.isArray(tours)) {
    return <p>Error: Tours data is not valid.</p>;
  }

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
                    <p>${price} / per month</p>
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
