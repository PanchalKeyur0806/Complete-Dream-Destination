import React, { useState } from "react";
import "./Feedback.css";
import { Link } from "react-router-dom";

const Feedback = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const closeMenu = () => {
    setIsActive(false);
  };

  return (
    <>
      <div
        className={`overlay ${isActive ? "active" : ""}`}
        onClick={closeMenu}
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
          <div className="menu-toggle" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <div className="user-info">
            <i className="fas fa-user"></i>
            Admin
          </div>
        </div>

        <div className="table-container">
          <h2>Feedbacks</h2>
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
              <tr
                data-feedback-id="FB001"
                data-user-name="John Doe"
                data-user-email="john.doe@example.com"
                data-package="Luxury Beach Package"
                data-full-feedback="Amazing experience, highly recommended!"
                data-rating="5"
                data-date="2025-01-15"
              >
                <td data-label="Feedback ID">FB001</td>
                <td data-label="User">John Doe</td>
                <td data-label="Package Name">Luxury Beach Package</td>
                <td data-label="Feedback">
                  Amazing experience, highly recommended!
                </td>
                <td data-label="Rating">5/5</td>
                <td data-label="Date">2025-01-15</td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button className="edit-button view-feedback">View</button>
                    <button className="delete-button">Delete</button>
                  </div>
                </td>
              </tr>
              {/* Other table rows remain the same */}
            </tbody>
          </table>
        </div>
      </main>

      <div className="feedback-modal">
        <div className="feedback-modal-content">
          {/* Modal content remains the same */}
        </div>
      </div>
    </>
  );
};

export default Feedback;
