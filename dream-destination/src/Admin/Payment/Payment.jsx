import React from 'react';
import './Payment.css';
import { Link } from 'react-router-dom';

function Payment() {
  // Filter apply handler
  const applyFilters = () => {
    console.log('Filters applied');
  };

  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Open and close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <aside className="sidebar">
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

      <div className="sidebar-overlay"></div>

      <main className="main-content">
        <div className="header">
          <div className="menu-toggle">
            <i className="fas fa-bars"></i>
          </div>
          <div className="user-info">
            <i className="fas fa-user"></i> Admin
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Filters Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
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
            </div>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Transaction ID</th>
                  <th className="p-3 text-left">Booking ID</th>
                  <th className="p-3 text-left">Customer Name</th>
                  <th className="p-3 text-right">Amount Paid</th>
                  <th className="p-3 text-left">Payment Method</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">TX12345</td>
                  <td className="p-3">BK56789</td>
                  <td className="p-3">John Doe</td>
                  <td className="p-3 text-right">$500</td>
                  <td className="p-3">Credit Card</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="p-3">2025-01-15</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      onClick={toggleModal}
                    >
                      View
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="payment-detail">
                  <label>Payment ID:</label>
                  <span className="payment-id">TX12345</span>
                </div>
                <div className="payment-detail">
                  <label>User Name:</label>
                  <span className="user-name">John Doe</span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary modal-close"
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
