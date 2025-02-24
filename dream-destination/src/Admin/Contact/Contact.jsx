import React, { useState, useEffect } from "react";
import "./Contact.css";
import { Link, useNavigate } from "react-router-dom";

const Contact = () => {
  const [isActive, setIsActive] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/users/me", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch user data");
        return response.json();
      })
      .then((data) => {
        if (data.data && data.data.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin && searchQuery.trim() === "") return;

    const fetchContacts = async () => {
      setLoading(true);
      setError(null);

      const url = searchQuery
        ? `http://localhost:8000/api/contact?search=${encodeURIComponent(
            searchQuery
          )}`
        : "http://localhost:8000/api/contact";

      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();
        setContacts(data.data || data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchContacts, 500); // Debounce API call for search

    return () => clearTimeout(debounceTimeout); // Cleanup on unmount or query change
  }, [searchQuery, isAdmin]);

  const handleViewContact = (feedback) => {
    setSelectedContact(feedback);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

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
            <Link to="/contact" className="nav-link active">
              <i className="fas fa-comments"></i>
              Contact
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
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                  <th>Contact ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td data-label="Contact ID">{contact._id}</td>
                      <td data-label="User">{contact.name}</td>
                      <td data-label="Email">{contact.email}</td>
                      <td data-label="Subject">{contact.subject}</td>
                      <td data-label="Message">{contact.message}</td>
                      <td data-label="Date">
                        {new Date(contact.createdAtIst).toLocaleDateString()}
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button
                            className="edit-button view-feedback"
                            onClick={() => handleViewContact(contact)}
                          >
                            View
                          </button>
                          <button
                            className="delete-button"
                            // onClick={() => handleDeleteFeedback(feedback)}
                          >
                            Delete
                          </button>
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

        {/* Feedback View Modal */}
        <div className={`contacts-modal ${showModal ? "show" : ""}`}>
          <div className="contact-modal-content">
            {selectedContact && (
              <>
                <div className="modal-header">
                  <h3>Contact Details</h3>
                  <button className="modal-close" onClick={handleCloseModal}>
                    ×
                  </button>
                </div>
                <div className="contact-detail">
                  <label>Contact Id:</label>
                  <p>{selectedContact._id}</p>
                </div>
                <div className="contact-detail">
                  <label>Name:</label>
                  <p>{selectedContact.name}</p>
                </div>
                <div className="contact-detail">
                  <label>Email:</label>
                  <p>{selectedContact.email}/5</p>
                </div>
                <div className="contact-detail">
                  <label>Subject:</label>
                  <p>{selectedContact.subject}</p>
                </div>
                <div className="contact-detail">
                  <label>Message:</label>
                  <p>{selectedContact.message}</p>
                </div>
                <div className="contact-detail">
                  <label>Date:</label>
                  <p>
                    {new Date(
                      selectedContact.createdAtIst
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  ) : null;
};

export default Contact;
