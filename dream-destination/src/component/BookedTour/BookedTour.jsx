import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./BookedTour.css"

const BookedTours = () => {
    const [bookedTours, setBookedTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/me', {
                    withCredentials: true // This is important to send cookies with the request
                });

                setUser(response.data);
            } catch (err) {
                console.error('Authentication failed:', err);
                setError('Please log in to view your bookings');
                navigate('/login'); // Redirect to login if not authenticated
            }
        };

        checkAuth();
    }, [navigate]);

    // Fetch booked tours once authenticated
    useEffect(() => {
        const fetchBookedTours = async () => {
            if (!user) return; // Don't fetch if not authenticated

            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8000/api/users/findbookedtour', {
                    withCredentials: true
                });

                console.log("my booking is.........", response.data.data)
                setBookedTours(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching booked tours:', err);
                setError('Failed to load your booked tours');
                setLoading(false);
            }
        };

        fetchBookedTours();
    }, [user]);

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (loading) {
        return <div className="loading">Loading your bookings...</div>;
    }

    return (
        <div className="booked-tours-container">
            <h1>My Booked Tours</h1>

            {bookedTours.length === 0 ? (
                <p>You haven't booked any tours yet.</p>
            ) : (
                <div className="tours-grid">
                    {bookedTours.map((tour) => (
                        <div key={tour._id} className="tour-card">
                            <h2>{tour.tour.name}</h2>
                            <p><strong>Booking Date:</strong> {new Date(tour.bookingAt).toLocaleDateString()}</p>
                            <p><strong>Duration:</strong> {tour.tour.duration} days</p>
                            <p><strong>Price:</strong> ${tour.totalPrice}</p>
                            {tour.image && <img src={tour.image} alt={tour.name} />}
                            <button
                                onClick={() => navigate(`/tours/${tour.tourId}`)}
                                className="view-details-btn"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookedTours;