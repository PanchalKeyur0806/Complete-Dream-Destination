import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../component/Header/Header";
import ExploreMenu from "../../component/ExploreMenu/ExploreMenu";
import TourDisplay from "../../component/TourDisplay/TourDisplay";
import AppDownload from "../../component/AppDownload/AppDownload";
import Footer from "../../component/Footer/Footer";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]); // Ensure tours starts as an empty array

  useEffect(() => {
    const apiUrl = searchTerm
      ? `http://localhost:8000/api/tours?search=${searchTerm}`
      : `http://localhost:8000/api/tours/`; // Fetch all tours if no search term

    console.log("Fetching from: ", apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("data is ................", data.tours);
        if (Array.isArray(data.tours)) {
          setTours(data.tours); // Only set tours if data is an array
        } else {
          setTours([]); // Prevent errors if response is not an array
        }
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        setTours([]); // Ensure state is always an array
      });
  }, [searchTerm]); // Runs whenever searchTerm changes

  return (
    <div>
      <Header onSearch={setSearchTerm} />
      <ExploreMenu />
      <TourDisplay tours={tours} />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
