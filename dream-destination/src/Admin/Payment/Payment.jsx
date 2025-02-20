import React, { useState } from "react";
import "./Payment.css";
import { Link } from "react-router-dom";

function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const applyFilters = () => {
    console.log("Filters applied");
  };

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
              />
              <select id="payment-status" className="w-full p-2 border rounded">
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
              <select id="payment-method" className="w-full p-2 border rounded">
                <option value="">All Methods</option>
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Booking ID</th>
                  <th>Customer Name</th>
                  <th className="text-right">Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TX12345</td>
                  <td>BK56789</td>
                  <td>John Doe</td>
                  <td className="text-right">$500</td>
                  <td>Credit Card</td>
                  <td>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td>2025-01-15</td>
                  <td>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                      onClick={toggleModal}
                    >
                      View
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Refund
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
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
                  <span>TX12345</span>
                </div>
                <div className="payment-detail">
                  <label>User Name:</label>
                  <span>John Doe</span>
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
