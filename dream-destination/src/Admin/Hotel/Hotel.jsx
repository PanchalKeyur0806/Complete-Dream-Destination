import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newHotel, setNewHotel] = useState({
        name: "",
        address: "",
        city: "",
        location: {
            coordinates: [0, 0] // [longitude, latitude]
        }
    });

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);

    const navigate = useNavigate();

    // Check if user is admin
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

    // Fetch hotels data
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

    // Effect to fetch hotels
    useEffect(() => {
        if (!isAdmin && searchQuery.trim() === "") return;

        const debounceTimeout = setTimeout(fetchHotels, 500); // Debounce API call for search

        return () => clearTimeout(debounceTimeout); // Cleanup on unmount or query change
    }, [searchQuery, isAdmin]);

    // Initialize map when create modal is shown
    useEffect(() => {
        if (showCreateModal && mapRef.current && !mapInstance.current) {
            // Default to a central location (can be customized)
            const defaultLocation = [0, 0]; // [lat, lng] for Leaflet

            // Initialize the map
            mapInstance.current = L.map(mapRef.current).setView([defaultLocation[1], defaultLocation[0]], 2);

            // Add tile layer (you may need to signup for a token depending on the provider)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            // Add a marker at the default location
            markerRef.current = L.marker([defaultLocation[1], defaultLocation[0]], {
                draggable: true // Allow marker to be dragged
            }).addTo(mapInstance.current);

            // Update coordinates when marker is dragged
            markerRef.current.on('dragend', function (event) {
                const marker = event.target;
                const position = marker.getLatLng();

                // Update the newHotel state with the new coordinates
                // Note: MongoDB and GeoJSON use [longitude, latitude] format
                setNewHotel(prev => ({
                    ...prev,
                    location: {
                        coordinates: [position.lng, position.lat]
                    }
                }));
            });

            // Add click handler to the map to reposition the marker
            mapInstance.current.on('click', function (e) {
                // Update marker position
                markerRef.current.setLatLng(e.latlng);

                // Update the newHotel state with the new coordinates
                setNewHotel(prev => ({
                    ...prev,
                    location: {
                        coordinates: [e.latlng.lng, e.latlng.lat]
                    }
                }));
            });
        }

        // Cleanup function
        return () => {
            if (mapInstance.current && showCreateModal === false) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerRef.current = null;
            }
        };
    }, [showCreateModal]);

    const confirmDelete = () => {
        fetch(`http://localhost:8000/api/hotel/${hotelToDelete._id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete hotel");
                }
                // Check if there's content to parse
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    // If no JSON is returned, just return a success object
                    return { success: true };
                }
            })
            .then((data) => {
                console.log("data is...............", data);
                // Update the hotels state directly by filtering out the deleted hotel
                setHotels((prevHotels) =>
                    prevHotels.filter((hotel) => hotel._id !== hotelToDelete._id)
                );
                alert("Hotel deleted successfully");
                setShowDeleteModal(false);
                setHotelToDelete(null);
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

    const handleCreateHotel = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewHotel({
            name: "",
            address: "",
            city: "",
            location: {
                coordinates: [0, 0]
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHotel(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCoordinateChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;

        // Update the newHotel state
        setNewHotel(prev => {
            const updatedCoordinates = [...prev.location.coordinates];
            if (name === "longitude") {
                updatedCoordinates[0] = numValue;
            } else if (name === "latitude") {
                updatedCoordinates[1] = numValue;
            }

            return {
                ...prev,
                location: {
                    coordinates: updatedCoordinates
                }
            };
        });

        // Update the marker position on the map
        if (markerRef.current) {
            const [lng, lat] = newHotel.location.coordinates;
            markerRef.current.setLatLng([
                name === "latitude" ? numValue : lat,
                name === "longitude" ? numValue : lng
            ]);
        }
    };

    const handleSubmitHotel = (e) => {
        e.preventDefault();

        // Check required fields
        if (!newHotel.name || !newHotel.address || !newHotel.city) {
            alert("Please fill in all required fields: Name, Address and City");
            return;
        }

        fetch("http://localhost:8000/api/hotel", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newHotel),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create hotel");
                }
                return response.json();
            })
            .then((data) => {
                alert("Hotel created successfully");
                handleCloseCreateModal();

                // Refresh the hotel list
                fetchHotels();
            })
            .catch((error) => {
                console.error("Error creating hotel:", error);
                alert("Error creating hotel: " + error.message);
            });
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
                    <button className="create-button" onClick={handleCreateHotel}>
                        Create hotel
                    </button>
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

                {/* Create Hotel Modal */}
                <div className={`contacts-modal ${showCreateModal ? "show" : ""}`}>
                    <div className="contact-modal-content">
                        <div className="modal-header">
                            <h3>Create New Hotel</h3>
                            <button className="modal-close" onClick={handleCloseCreateModal}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmitHotel}>
                            <div className="form-group">
                                <label htmlFor="name">Name: <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newHotel.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address: <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={newHotel.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City: <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={newHotel.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location: <span className="required">*</span></label>
                                <div className="coordinates-inputs">
                                    <div>
                                        <label htmlFor="longitude">Longitude:</label>
                                        <input
                                            type="number"
                                            id="longitude"
                                            name="longitude"
                                            step="any"
                                            value={newHotel.location.coordinates[0]}
                                            onChange={handleCoordinateChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="latitude">Latitude:</label>
                                        <input
                                            type="number"
                                            id="latitude"
                                            name="latitude"
                                            step="any"
                                            value={newHotel.location.coordinates[1]}
                                            onChange={handleCoordinateChange}
                                        />
                                    </div>
                                </div>
                                <div className="map-container">
                                    <div ref={mapRef} style={{ height: '300px', width: '100%', marginTop: '10px' }}></div>
                                    <p className="map-instructions">Click on the map to set the hotel location or drag the marker.</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Hotel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    ) : null;
};

export default Hotels;