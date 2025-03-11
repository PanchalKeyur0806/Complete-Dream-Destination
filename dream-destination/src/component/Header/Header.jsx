import React from "react";
import { useState } from "react";
import "./Header.css";
import video from "../../assets/video.mp4";
import { FaLocationDot } from "react-icons/fa6";
import { CiFilter } from "react-icons/ci";

function Header({ onSearch }) {
  // State for all search fields
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Handle destination input change
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  // Handle check-in date change
  const handleCheckInChange = (e) => {
    setCheckInDate(e.target.value);
  };

  // Handle check-out date change
  const handleCheckOutChange = (e) => {
    setCheckOutDate(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create search parameters object with all fields
    const searchParams = {
      destination,
      checkInDate,
      checkOutDate
    };

    // Call the onSearch prop with all search parameters
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <section className="home">
      <div className="overlay"></div>

      <video src={video} muted autoPlay loop type="video/mp4"></video>

      <div className="homecontent container">
        <div className="textDiv">
          <span className="smallText">Our Packages</span>
          <h1 className="homeTitle">Search your Holiday</h1>
        </div>

        <div className="cardDiv">
          <form className="d-flex align-items-center justify-content-center gap-5" onSubmit={handleSubmit}>
            <div className="col">
              <label htmlFor="searchInput" className="form-label">
                Search your destination:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name here..."
                id="searchInput"
                value={destination}
                onChange={handleDestinationChange}
              />
            </div>
            <div className="col">
              <label htmlFor="checkInDate">Check in</label>
              <input
                type="date"
                className="form-control"
                id="checkInDate"
                value={checkInDate}
                onChange={handleCheckInChange}
              />
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">Search Tour</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Header;