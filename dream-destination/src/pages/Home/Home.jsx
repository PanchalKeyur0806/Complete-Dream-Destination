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
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "" // 'success' or 'error'
  });

  useEffect(() => {
    // Skip the effect on initial render with empty search params
    if (!searchParams.destination && !searchParams.checkInDate && !searchParams.checkOutDate) {
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

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const fetchTours = () => {
    let apiUrl = "http://localhost:8000/api/tours";

    // Check which parameters are provided and build the URL accordingly
    if (searchParams.destination && (searchParams.checkInDate || searchParams.checkOutDate)) {
      // If we have both destination and dates, we need to make separate API calls
      // First, try searching by destination
      apiUrl = `http://localhost:8000/api/tours?search=${encodeURIComponent(searchParams.destination)}`;

      if (searchParams.checkInDate) {
        apiUrl += `&date=${encodeURIComponent(searchParams.checkInDate)}`;
      }
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

          // Show success notification if tours were found
          if (data.tours.length > 0) {
            setNotification({
              show: true,
              message: `Successfully found ${data.tours.length} tour(s)!`,
              type: "success"
            });
          } else {
            // Show message when no tours match the search criteria
            setNotification({
              show: true,
              message: "No tours found matching your search criteria.",
              type: "info"
            });
          }
        } else {
          setTours([]);
          setNotification({
            show: true,
            message: "Error loading tours. Please try again.",
            type: "error"
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        setTours([]);
        setNotification({
          show: true,
          message: "Error connecting to server. Please try again later.",
          type: "error"
        });
      });
  };

  // Handle search from Header component
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div>
      <Header onSearch={handleSearch} />
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification({ ...notification, show: false })}>×</button>
        </div>
      )}
      <ExploreMenu />
      <TourDisplay tours={tours} />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;