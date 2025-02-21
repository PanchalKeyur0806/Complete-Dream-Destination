import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import "./User.css";

function User() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user role
  useEffect(() => {
    fetch("http://localhost:8000/api/users/me", {
      credentials: "include", // If using cookies for authentication
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/"); // Redirect non-admin users
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      console.log(searchQuery);

      const response = await axios.get(
        `http://localhost:8000/api/users?search=${searchQuery}`,
        { withCredentials: true }
      );
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users only if the user is an admin
  useEffect(() => {
    if (searchQuery) {
      fetchUsers();
    } else if (isAdmin) {
      // Fetch all users if admin & no search query
      fetch("http://localhost:8000/api/users", {
        method: "GET",
        credentials: "include", // Send cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          return response.json();
        })
        .then((data) => {
          setUsers(data.data.users);
          console.log("Data of all users:", data.data.users);
        })
        .catch((error) => console.error("Error fetching users:", error));
    } else {
      setUsers([]);
    }
  }, [searchQuery, isAdmin]);

  useEffect(() => {
    if (searchQuery) fetchUsers();
    else setUsers([]);
  }, [searchQuery]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        className={`overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="brand">Travel Admin</div>
        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/admin" className="nav-link">
              <i className="fas fa-chart-line"></i> Overview
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user" className="nav-link">
              <i className="fas fa-users"></i> Manage Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/package" className="nav-link">
              <i className="fas fa-box"></i> Packages
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/payment" className="nav-link">
              <i className="fas fa-credit-card"></i> Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link">
              <i className="fas fa-comments"></i> Feedback
            </Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header">
          <div className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </div>
          <div className="user-info">
            <i className="fas fa-user"></i> Admin
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="container">
          {isAdmin ? (
            <div className="users-list">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td data-label="User ID">{user._id}</td>
                        <td data-label="Name">{user.name}</td>
                        <td data-label="Email">{user.email}</td>
                        <td
                          data-label="Status"
                          className={
                            user.active ? "status-active" : "status-inactive"
                          }
                        >
                          {user.active ? "Active" : "Not Active"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <h2>Access Denied</h2>
          )}
        </div>
      </main>
    </>
  );
}

export default User;
