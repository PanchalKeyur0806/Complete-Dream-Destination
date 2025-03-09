import React, { useState, useEffect } from "react";
// import "./Contact.css";
import { Link, useNavigate } from "react-router-dom";

const Hotels = () => {
    const [isActive, setIsActive] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHotel, setSelectedHotel] = useState(null);

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

        const fetchHotels = async () => {
            setLoading(true);
            setError(null);

            const url = searchQuery
                ? `http://localhost:8000/api/hotel?search=${encodeURIComponent(
                    searchQuery
                )}`
                : "http://localhost:8000/api/hotel";

            try {
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch hotels");
                }

                const data = await response.json();
                setHotels(data.data || data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(fetchHotels, 500); // Debounce API call for search

        return () => clearTimeout(debounceTimeout); // Cleanup on unmount or query change
    }, [searchQuery, isAdmin]);

    const confirmDelete = () => {
        // console.log("Hotels to delete.................", hotelToDelete)
        fetch(`http://localhost:8000/api/hotel/${hotelToDelete._id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log("response is...................", response)
                if (!response.ok) {
                    throw new Error("Failed to delete hotel");
                }
                return response.json(); // You might need this if your API returns JSON
            })
            .then((data) => {
                setHotels((prevHotels) =>
                    prevHotels.filter((hotel) => hotel._id !== hotelToDelete._id)
                );
                alert("Hotel deleted successfully");
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.error("Error deleting hotel:", error);
                alert("Error deleting hotel");
                setShowDeleteModal(false);
            });
    };

    const handleDeleteHotel = (hotel) => {
        setHotelToDelete(hotel);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setHotelToDelete(null);
    };

    const handleViewHotel = (hotel) => {
        setSelectedHotel(hotel);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHotel(null);
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
                        <Link to="/" className="nav-link">
                            <i className="fas fa-chart-line"></i>
                            Home
                        </Link>
                    </li>
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
                        <Link to="/feedback" className="nav-link">
                            <i className="fas fa-comments"></i>
                            Feedback
                        </Link>
                        <Link to="/contact" className="nav-link">
                            <i className="fas fa-comments"></i>
                            Contact
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/hotels" className="nav-link active">
                            <i className="fas fa-hotel"></i>
                            Hotels
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
                        placeholder="Search hotels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="table-container">
                    <h2>Hotels </h2>

                    {loading ? (
                        <p>Loading Hotels...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Hotel ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    <th>Coordinates</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.length > 0 ? (
                                    hotels.map((hotel) => (
                                        <tr key={hotel._id}>
                                            <td data-label="Hotel ID">{hotel._id}</td>
                                            <td data-label="Name">{hotel.name}</td>
                                            <td data-label="Address">{hotel.address}</td>
                                            <td data-label="City">{hotel.city}</td>
                                            <td data-label="Coordinates">
                                                {hotel.location && hotel.location.coordinates ?
                                                    `[${hotel.location.coordinates[0]}, ${hotel.location.coordinates[1]}]` :
                                                    'N/A'}
                                            </td>
                                            <td data-label="Actions">
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button view-feedback"
                                                        onClick={() => handleViewHotel(hotel)}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDeleteHotel(hotel)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No Hotels available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Hotel View Modal */}
                <div className={`contacts-modal ${showModal ? "show" : ""}`}>
                    <div className="contact-modal-content">
                        {selectedHotel && (
                            <>
                                <div className="modal-header">
                                    <h3>Hotel Details</h3>
                                    <button className="modal-close" onClick={handleCloseModal}>
                                        ×
                                    </button>
                                </div>
                                <div className="contact-detail">
                                    <label>Hotel ID:</label>
                                    <p>{selectedHotel._id}</p>
                                </div>
                                <div className="contact-detail">
                                    <label>Name:</label>
                                    <p>{selectedHotel.name}</p>
                                </div>
                                <div className="contact-detail">
                                    <label>Address:</label>
                                    <p>{selectedHotel.address}</p>
                                </div>
                                <div className="contact-detail">
                                    <label>City:</label>
                                    <p>{selectedHotel.city}</p>
                                </div>
                                <div className="contact-detail">
                                    <label>Location Coordinates:</label>
                                    <p>
                                        {selectedHotel.location && selectedHotel.location.coordinates ?
                                            `Longitude: ${selectedHotel.location.coordinates[0]}, Latitude: ${selectedHotel.location.coordinates[1]}` :
                                            'Not available'}
                                    </p>
                                </div>
                                {selectedHotel.phone && (
                                    <div className="contact-detail">
                                        <label>Phone:</label>
                                        <p>{selectedHotel.phone}</p>
                                    </div>
                                )}
                                {selectedHotel.email && (
                                    <div className="contact-detail">
                                        <label>Email:</label>
                                        <p>{selectedHotel.email}</p>
                                    </div>
                                )}
                                {selectedHotel.website && (
                                    <div className="contact-detail">
                                        <label>Website:</label>
                                        <p>{selectedHotel.website}</p>
                                    </div>
                                )}
                                {selectedHotel.createdAt && (
                                    <div className="contact-detail">
                                        <label>Created At:</label>
                                        <p>
                                            {new Date(selectedHotel.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="delete-modal">
                        <div className="delete-modal-content">
                            <div className="modal-header">
                                <h3>Are you sure you want to delete this hotel?</h3>
                                <button className="modal-close" onClick={cancelDelete}>
                                    ×
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={cancelDelete}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger" onClick={confirmDelete}>
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    ) : null;
};

export default Hotels;