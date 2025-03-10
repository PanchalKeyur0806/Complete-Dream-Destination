import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import Cookies from "js-cookie";

function Navbar({ setShowLogin }) {
  const [menu, setMenu] = useState("home");
  const [active, setActive] = useState("navBar");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        console.log("Raw API Response:", data); // Debugging

        if (data.status === "success" && data.data) {
          setUserData(data.data);
          setIsLoggedIn(true);
          console.log("User logged in:", data.data);
        } else {
          throw new Error("Invalid user data structure");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsLoggedIn(false);
        setUserData(null);
        Cookies.remove("jwt", { path: "/" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const showNav = () => setActive("navBar activeNavbar");
  const removeNavbar = () => setActive("navBar");

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("jwt");

      const response = await fetch("http://localhost:8000/api/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");

      Cookies.remove("jwt", { path: "/" });
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
      setUserData(null);
      setShowLogin(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      Cookies.remove("jwt", { path: "/" });
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="/" className="logo" />
      </Link>
      <div className={active}>
        <ul className="navbar-menu mt-3">
          <Link
            to={userData?.role === "admin" ? "/admin" : "/"}
            onClick={() => {
              setMenu("home");
              removeNavbar();
            }}
            className={menu === "home" ? "active" : ""}
          >
            {userData?.role === "admin" ? "Admin" : "Home"}
          </Link>
          <Link
            to="/explore"
            onClick={() => {
              setMenu("ExploreMenu");
              removeNavbar();
            }}
            className={menu === "menu" ? "active" : ""}
          >
            Explore Menu
          </Link>
          <Link
            to="/tour"
            onClick={() => {
              setMenu("mobile-app");
              removeNavbar();
            }}
            className={menu === "mobile-app" ? "active" : ""}
          >
            Mobile App
          </Link>
          <Link
            to="/contact"
            onClick={() => {
              setMenu("contact-us");
              removeNavbar();
            }}
            className={menu === "contact-us" ? "active" : ""}
          >
            Contact Us
          </Link>
          <div onClick={removeNavbar} className="closeNavbar">
            <IoIosCloseCircle className="navIcon" />
          </div>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" className="icon" />
        <div className="navbar-search-icon">
          <Link to="/my-bookings">
            <img src={assets.basket_icon} alt="Cart" className="icon" />
          </Link>
        </div>
        {isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Welcome, {userData?.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
        )}

        <div onClick={showNav} id="navBtn">
          <RxHamburgerMenu />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
