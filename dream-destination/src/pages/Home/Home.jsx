import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../component/Header/Header";
import ExploreMenu from "../../component/ExploreMenu/ExploreMenu";
import TourDisplay from "../../component/TourDisplay/TourDisplay";
import AppDownload from "../../component/AppDownload/AppDownload";
import Footer from "../../component/Footer/Footer";

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkInDate: "",
    checkOutDate: ""
  });
  const [tours, setTours] = useState([]);

  useEffect(() => {
    // Skip the effect on initial render with empty search params
    if (Object.keys(searchParams).length === 0) {
      return;
    }

    // Only fetch when button is clicked (searchParams changes)
    fetchTours();
  }, [searchParams]);

  // Initial fetch on component mount
  useEffect(() => {
    fetch("http://localhost:8000/api/tours/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.tours)) {
          setTours(data.tours);
        } else {
          setTours([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching initial tours:", error);
        setTours([]);
      });
  }, []);

  const fetchTours = () => {
    let apiUrl = "http://localhost:8000/api/tours";

    // Check which parameters are provided and build the URL accordingly
    if (searchParams.destination && (searchParams.checkInDate || searchParams.checkOutDate)) {
      // If we have both destination and dates, we need to make separate API calls
      // First, try searching by destination
      apiUrl = `http://localhost:8000/api/tours?search=${encodeURIComponent(searchParams.destination)}`;
    } else if (searchParams.destination) {
      // Only destination provided
      apiUrl = `http://localhost:8000/api/tours?search=${encodeURIComponent(searchParams.destination)}`;
    } else if (searchParams.checkInDate) {
      // Only check-in date provided
      apiUrl = `http://localhost:8000/api/tours?date=${encodeURIComponent(searchParams.checkInDate)}`;
    } else if (searchParams.checkOutDate) {
      // Only check-out date provided
      apiUrl = `http://localhost:8000/api/tours?date=${encodeURIComponent(searchParams.checkOutDate)}`;
    }

    console.log("Fetching from: ", apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("data is ................", data.tours);
        if (Array.isArray(data.tours)) {
          setTours(data.tours);
        } else {
          setTours([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        setTours([]);
      });
  };

  // Handle search from Header component
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div>
      <Header onSearch={handleSearch} />
      <ExploreMenu />
      <TourDisplay tours={tours} />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;