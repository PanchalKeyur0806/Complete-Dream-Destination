import React, { useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import Cookies from "js-cookie";

const LoginPopUp = ({ setShowLogin, setUserName }) => {
  const [currState, setCurrState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currState === "Sign Up" && !formData.name) {
      alert("Please enter your name.");
      return;
    }
    if (!formData.email || !formData.password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    const apiUrl =
      currState === "Sign Up"
        ? "http://localhost:8000/api/users/signup"
        : "http://localhost:8000/api/users/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Ensures cookies are sent & received
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // The backend should set the JWT cookie automatically
      if (data.data && data.data.user) {
        setUserName(data.data.user.name);

        // Store user info in localStorage for persistence
        localStorage.setItem("userName", data.data.user.name);

        // Verify if the JWT cookie exists
        const jwt = Cookies.get("jwt");
        if (!jwt) {
          if (data.token) {
            // Fallback: Set cookie manually if the backend didn't set it
            Cookies.set("jwt", data.token, {
              expires: 7,
              path: "/",
              sameSite: "Lax",
            });
          } else {
            console.warn("JWT cookie not found.");
          }
        }
      }

      alert(`${currState} successful!`);
      setShowLogin(false);

      // Ensure reloading updates auth state
      window.location.reload();
    } catch (err) {
      console.error("Auth error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading
            ? "Processing..."
            : currState === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
