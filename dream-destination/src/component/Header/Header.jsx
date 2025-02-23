import React from "react";
import { useState, useEffect } from "react";
import "./Header.css";
import video from "../../assets/video.mp4";
import { FaLocationDot } from "react-icons/fa6";
import { CiFilter } from "react-icons/ci";

function Header({ onSearch }) {
  // Accept onSearch as a prop
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value); // Call onSearch only if it exists
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
          <form className="d-flex align-items-center justify-content-center gap-5">
            <div className="col">
              <label htmlFor="searchInput" className="form-label">
                Search your destination:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name here..."
                id="searchInput"
                value={searchTerm}
                onChange={handleSearch} // Call handleSearch on input change
              />
            </div>
            <div className="col">
              <label htmlFor="date">Select your date:</label>
              <input type="date" className="form-control" id="date" />
            </div>
            <div className="col">
              <label htmlFor="price">Max Price:</label>
              <input type="range" className="form-control" id="price" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Header;
