import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";

function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch user role to check if logged in as admin
  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/me", {
          withCredentials: true,
        });

        if (
          response.data?.status === "success" &&
          response.data?.data?.role === "admin"
        ) {
          console.log("response data.......", response.data.data);
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching admin status:", error);
        setIsAdmin(false);
      }
    };

    fetchAdminStatus();
  }, []);

  // Fetch total revenue (only if admin)
  useEffect(() => {
    if (isAdmin) {
      const fetchTotalData = async () => {
        try {
          // Fetch total revenue
          const revenueResponse = await axios.get(
            "http://localhost:8000/api/bookings/totalrevenue",
            { withCredentials: true }
          );

          if (revenueResponse.data.status === "success") {
            console.log(
              "Total revenue fetched:",
              revenueResponse.data.data.revenue
            );
            setTotalRevenue(revenueResponse.data.data.revenue);
          } else {
            console.error("Failed to fetch revenue:", revenueResponse.data);
          }

          // Fetch total users
          const usersResponse = await axios.get(
            "http://localhost:8000/api/users/totalusers",
            { withCredentials: true }
          );

          if (usersResponse.data.status === "success") {
            console.log(
              "Total users fetched:",
              usersResponse.data.allUsers[0].users
            );
            setTotalUsers(usersResponse.data.allUsers[0].users);
          } else {
            console.error("Failed to fetch total users:", usersResponse.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchTotalData();
    }
  }, [isAdmin]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <div
        className={`overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="brand">Travel Admin</div>
        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/admin" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-chart-line"></i> Overview
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-users"></i> Manage Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/package" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-box"></i> Packages
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/payment" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-credit-card"></i> Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-comments"></i> Feedback
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contacts" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-comments"></i> Contacts
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
            <i className="fas fa-user"></i> {isAdmin ? "Admin" : "Guest"}
          </div>
        </div>

        {isAdmin ? (
          <div className="overview-cards">
            <div className="card">
              <div className="card-header">
                <h3>Total Revenue</h3>
                <div className="card-icon revenue">
                  <i className="fas fa-dollar-sign"></i>
                </div>
              </div>
              <div className="card-body">
                <h2>
                  $
                  {totalRevenue !== null
                    ? totalRevenue.toLocaleString()
                    : "Loading..."}
                </h2>
                {/* <p>+12% from last month</p> */}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3>Active Users</h3>
                <div className="card-icon users">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div className="card-body">
                <h2>{totalUsers !== null ? totalUsers : "No users found"}</h2>
                {/* <p>+5% from last month</p> */}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3>Total Packages</h3>
                <div className="card-icon packages">
                  <i className="fas fa-box"></i>
                </div>
              </div>
              <div className="card-body">
                <h2>85</h2>
                <p>+3 new packages</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3>Feedback</h3>
                <div className="card-icon feedback">
                  <i className="fas fa-comments"></i>
                </div>
              </div>
              <div className="card-body">
                <h2>4.8/5</h2>
                <p>Based on 450 reviews</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="error-message">
            Access denied. You must be an admin to view this page.
          </p>
        )}
      </main>
    </>
  );
}

export default AdminPanel;
