import React, { useState, useEffect } from "react";
import "./Feedback.css";
import { Link, useNavigate } from "react-router-dom";

const Feedback = () => {
  const [isActive, setIsActive] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/users/me", {
      credentials: "include", // If using cookies for authentication
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch user data");
        return response.json();
      })
      .then((data) => {
        if (data.data && data.data.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/"); // Redirect non-admin users
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    fetch("http://localhost:8000/api/reviews", {
      method: "GET",
      credentials: "include", // Send cookies for authentication
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Review is: ", data.data);
        setFeedbacks(data.data); // FIX: Setting correct state
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false)); // FIX: Ensure loading state is updated
  }, [isAdmin]);

  return isAdmin ? (
    <>
      <div
        className={`overlay ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(false)}
      ></div>

      <aside className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="brand">Travel Admin</div>
        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/admin" className="nav-link">
              <i className="fas fa-chart-line"></i>
              Overview
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user" className="nav-link">
              <i className="fas fa-users"></i>
              Manage Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/package" className="nav-link">
              <i className="fas fa-box"></i>
              Packages
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/payment" className="nav-link">
              <i className="fas fa-credit-card"></i>
              Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link active">
              <i className="fas fa-comments"></i>
              Feedback
            </Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header">
          <div className="menu-toggle" onClick={() => setIsActive(!isActive)}>
            <i className="fas fa-bars"></i>
          </div>
          <div className="user-info">
            <i className="fas fa-user"></i>
            Admin
          </div>
        </div>

        <div className="table-container">
          <h2>Feedbacks</h2>

          {loading ? (
            <p>Loading feedbacks...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Feedback ID</th>
                  <th>User</th>
                  <th>Package Name</th>
                  <th>Feedback</th>
                  <th>Rating</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <tr key={feedback._id}>
                      <td data-label="Feedback ID">{feedback._id}</td>
                      <td data-label="User">{feedback.user.name}</td>
                      <td data-label="Package Name">{feedback.tour.name}</td>
                      <td data-label="Feedback">{feedback.review}</td>
                      <td data-label="Rating">{feedback.rating}/5</td>
                      <td data-label="Date">
                        {new Date(feedback.createdAtIst).toLocaleDateString()}
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button className="edit-button view-feedback">
                            View
                          </button>
                          <button className="delete-button">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No feedbacks available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  ) : null;
};

export default Feedback;
