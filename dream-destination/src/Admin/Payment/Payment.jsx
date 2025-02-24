import React, { useState, useEffect } from "react";
import "./Payment.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Step 1: Check user authentication
        const authResponse = await fetch("http://localhost:8000/api/users/me", {
          credentials: "include",
        });

        if (!authResponse.ok) {
          throw new Error(
            `Authentication failed with status: ${authResponse.status}`
          );
        }

        const userData = await authResponse.json();

        if (userData.data?.role !== "admin") {
          console.log("User is not an admin, redirecting to home");
          navigate("/");
          return;
        }

        setIsAdmin(true);

        // Step 2: Fetch bookings with optional startDate filter
        const bookingsUrl = searchQuery
          ? `http://localhost:8000/api/bookings?startDate=${searchQuery}`
          : "http://localhost:8000/api/bookings";

        const bookingsResponse = await axios.get(bookingsUrl, {
          withCredentials: true,
        });

        if (!bookingsResponse.data) {
          throw new Error("Failed to fetch bookings");
        }

        setBookings(bookingsResponse.data.data || []);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load data. Please try again later.");
        if (error.message.includes("Authentication failed")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate, searchQuery]); // Refetch when searchQuery changes

  const toggleModal = (booking = null) => {
    setSelectedBooking(booking);
    setIsModalOpen(!isModalOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const applyFilters = () => {
    console.log("Filters applied");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
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
            <Link to="/payment" className="nav-link active">
              <i className="fas fa-credit-card"></i>
              Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link">
              <i className="fas fa-comments"></i>
              Feedback
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contacts" className="nav-link">
              <i className="fas fa-comments"></i>
              Contacts
            </Link>
          </li>
        </ul>
      </aside>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <main className="main-content">
        <div className="header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="user-info">
            <i className="fas fa-user"></i> Admin
          </div>
        </div>

        <div className="container">
          {/* Filters Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6 padding">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="date"
                id="start-date"
                className="w-full p-2 border rounded"
                value={searchQuery} // Bind value to state
                onChange={(e) => setSearchQuery(e.target.value)} // Update state on change
              />
            </div>
          </div>

          {/* Updated Payments Table */}
          <div className="table-wrapper bg-white shadow rounded-lg">
            <div className="table-container">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th className="sticky-header">Payment ID</th>
                    <th className="sticky-header">Booking ID</th>
                    <th className="sticky-header">Tour Name</th>
                    <th className="sticky-header">Customer Name</th>
                    <th className="sticky-header text-right">Amount Paid</th>
                    <th className="sticky-header">Number of Guests</th>
                    <th className="sticky-header">Status</th>
                    <th className="sticky-header">Date</th>
                    <th className="sticky-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td data-label="Payment ID" className="cell-content">
                        {booking.paymentId}
                      </td>
                      <td data-label="Booking ID" className="cell-content">
                        {booking._id}
                      </td>
                      <td data-label="Tour Name" className="cell-content">
                        {booking.tour.name}
                      </td>
                      <td data-label="Customer Name" className="cell-content">
                        {booking.user.name}
                      </td>
                      <td
                        data-label="Amount Paid"
                        className="cell-content text-right"
                      >
                        ${booking.totalPrice}
                      </td>
                      <td
                        data-label="Number of Guests"
                        className="cell-content"
                      >
                        {booking.numberOfGuests}
                      </td>
                      <td data-label="Status" className="cell-content">
                        <span
                          className={`status-badge ${
                            booking.status === "paid"
                              ? "status-paid"
                              : booking.status === "pending"
                              ? "status-pending"
                              : "status-refunded"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td data-label="Date" className="cell-content">
                        {booking.createdAtIst}
                      </td>
                      <td className="cell-content">
                        <button
                          className="btn-view"
                          onClick={() => toggleModal(booking)}
                        >
                          View
                        </button>
                        <button className="btn-refund">Refund</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedBooking && (
          <div className="payment-modal">
            <div className="payment-modal-content">
              <div className="modal-header">
                <h2>Payment Details</h2>
                <button className="modal-close" onClick={toggleModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="payment-detail">
                  <label>Payment ID:</label>
                  <span>{selectedBooking.paymentId}</span>
                </div>
                <div className="payment-detail">
                  <label>Booking ID:</label>
                  <span>{selectedBooking._id}</span>
                </div>
                <div className="payment-detail">
                  <label>Tour Name:</label>
                  <span>{selectedBooking.tour.name}</span>
                </div>
                <div className="payment-detail">
                  <label>Customer Name:</label>
                  <span>{selectedBooking.user.name}</span>
                </div>
                <div className="payment-detail">
                  <label>Amount Paid:</label>
                  <span>${selectedBooking.totalPrice}</span>
                </div>
                <div className="payment-detail">
                  <label>Number of Guests:</label>
                  <span>{selectedBooking.numberOfGuests}</span>
                </div>
                <div className="payment-detail">
                  <label>Status:</label>
                  <span>{selectedBooking.status}</span>
                </div>
                <div className="payment-detail">
                  <label>Date:</label>
                  <span>{selectedBooking.createdAtIst}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Payment;
