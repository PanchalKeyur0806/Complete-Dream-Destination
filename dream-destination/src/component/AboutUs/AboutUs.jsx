import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import { MapPin, Clock, Phone, ShieldCheck, UserCheck, ThumbsUp, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const AboutUs = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/reviews');
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const data = await response.json();
                console.log("Data is .........", data)

                // Filter for only 5-star reviews
                const fiveStarReviews = data.data.filter(review => review.rating === 5);
                console.log("Filtered reviews is .......", fiveStarReviews)

                // Take only 3 reviews
                const topThreeReviews = fiveStarReviews.slice(0, 3);

                setReviews(topThreeReviews);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const services = [
        { title: "Customized Travel Packages", description: "Tailor-made itineraries designed around your preferences, budget, and travel style." },
        { title: "International & Domestic Tours", description: "Expertly curated group and private tours to destinations worldwide." },
        { title: "Luxury Vacations", description: "Exclusive experiences, premium accommodations, and VIP services." },
        { title: "Adventure Trips", description: "Thrilling expeditions for adrenaline seekers and outdoor enthusiasts." },
        { title: "Budget-Friendly Options", description: "Quality travel experiences that don't break the bank." },
        { title: "Visa & Documentation Assistance", description: "Streamlined visa processing and travel documentation support." }
    ];

    return (
        <div className="about-us-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="overlay"></div>
                <div className="hero-content">
                    <h1>About Dream Destination</h1>
                    <p>Turning travel dreams into unforgettable realities since 2015</p>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="intro-section container">
                <h2>Welcome to Dream Destination</h2>
                <div className="separator"></div>
                <p>
                    At Dream Destination, we believe that travel is more than just visiting new places—it's about creating
                    meaningful connections, discovering diverse cultures, and collecting memories that last a lifetime.
                    Our dedicated team of travel experts is committed to crafting seamless, personalized journeys that
                    allow you to explore the world effortlessly and authentically.
                </p>
            </section>

            {/* Our Story Section */}
            <section className="story-section">
                <div className="container">
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <div className="separator"></div>
                        <p>
                            Dream Destination was born from a shared passion for exploration and a desire to make travel accessible
                            to everyone. Founded in 2015 by a group of experienced travelers and industry professionals, our agency
                            began with a simple mission: to transform how people experience the world.
                        </p>
                        <p>
                            What started as a small operation has grown into a trusted travel partner for thousands of adventurers
                            worldwide. Through economic fluctuations and global challenges, our commitment to exceptional service
                            and authentic experiences has remained unwavering. Each journey we plan is infused with the same
                            enthusiasm and attention to detail that inspired us to establish Dream Destination.
                        </p>
                    </div>
                    <div className="story-image">
                        <img src="/src/assets/aboutus.svg" alt="Dream Destination founders" />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section container">
                <h2>Our Services</h2>
                <div className="separator"></div>
                <p className="section-intro">
                    From meticulously planned itineraries to unexpected touches that delight, we provide comprehensive
                    travel services tailored to your unique preferences and needs.
                </p>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
                <div className="additional-services">
                    <h3>We also provide:</h3>
                    <ul>
                        <li><Clock size={18} /> 24/7 Travel Support</li>
                        <li><ShieldCheck size={18} /> Travel Insurance</li>
                        <li><MapPin size={18} /> Accommodation Bookings</li>
                        <li><UserCheck size={18} /> Local Guides & Experiences</li>
                    </ul>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-us-section">
                <div className="container">
                    <h2>Why Choose Us?</h2>
                    <div className="separator"></div>
                    <div className="why-us-grid">
                        <div className="why-us-card">
                            <div className="icon-circle">
                                <ThumbsUp size={24} />
                            </div>
                            <h3>Personalized Service</h3>
                            <p>Every itinerary is crafted specifically for you, considering your interests, pace, and style.</p>
                        </div>
                        <div className="why-us-card">
                            <div className="icon-circle">
                                <ShieldCheck size={24} />
                            </div>
                            <h3>Best Price Guarantee</h3>
                            <p>We leverage our industry relationships to ensure you get exceptional value for your investment.</p>
                        </div>
                        <div className="why-us-card">
                            <div className="icon-circle">
                                <Clock size={24} />
                            </div>
                            <h3>24/7 Support</h3>
                            <p>Our team is always available to assist you before, during, and after your journey.</p>
                        </div>
                        <div className="why-us-card">
                            <div className="icon-circle">
                                <UserCheck size={24} />
                            </div>
                            <h3>Destination Expertise</h3>
                            <p>Our specialists have firsthand knowledge of the destinations we recommend.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Now with API Data Only */}
            <section className="testimonials-section container">
                <h2>Our Top-Rated Reviews</h2>
                <div className="separator"></div>
                {loading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p>Unable to load reviews at this time. Please try again later.</p>
                ) : (
                    <div className="testimonials-grid">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div className="testimonial-card" key={index}>
                                    <div className="testimonial-header">
                                        <div>
                                            <h3>{review.user?.name || "Happy Traveler"}</h3>
                                            <p>{review.tour?.name || "Amazing Tour"}</p>
                                            <div className="rating">★★★★★</div>
                                        </div>
                                    </div>
                                    <p className="testimonial-text">"{review.review}"</p>
                                </div>
                            ))
                        ) : (
                            <p>No 5-star reviews available at the moment. Check back soon!</p>
                        )}
                    </div>
                )}
            </section>

            {/* Contact Section - Modified to show only contact info, no form */}
            <section className="contact-section">
                <div className="container">
                    <h2>Get in Touch</h2>
                    <div className="separator"></div>
                    <p>Ready to start planning your next adventure? Our travel experts are just a message away.</p>
                    <div className="contact-info-centered">
                        <div className="contact-item">
                            <Phone size={20} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={20} />
                            <span>info@dreamdestination.com</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={20} />
                            <span>123 Travel Lane, Adventure City, AC 12345</span>
                        </div>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">
                                <Facebook size={24} />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <Instagram size={24} />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <Twitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="overlay"></div>
                <div className="container">
                    <h2>Begin Your Journey Today</h2>
                    <p>Let us help you turn your travel dreams into unforgettable experiences.</p>
                    <button className="btn btn-light"><a href="/tour">Plan Your Trip</a></button>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;