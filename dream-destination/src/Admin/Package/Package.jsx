import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Package.css";

const Package = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    package_name: "",
    package_description: "",
    duration: "",
    price: "",
    start_date: "",
    end_date: "",
    status: "active",
    discount: "",
    package_image: null,
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    setFormData({
      package_name: "",
      package_description: "",
      duration: "",
      price: "",
      start_date: "",
      end_date: "",
      status: "active",
      discount: "",
      package_image: null,
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Automatically close the sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchPackages();
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only apply on mobile screens
      if (window.innerWidth <= 768 && isSidebarOpen) {
        const sidebar = document.querySelector(".sidebar");
        const menuToggle = document.querySelector(".menu-toggle");

        // Check if click is outside sidebar and not on the menu toggle
        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          menuToggle &&
          !menuToggle.contains(event.target)
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tours");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackages(data.tours || []); // Ensure correct response structure
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );
    if (!confirmDelete) return; // If user clicks "Cancel", exit function

    try {
      const response = await fetch(`http://localhost:8000/api/tours/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete package");
      }

      alert("Package deleted successfully!");
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg._id !== id)
      );
    } catch (err) {
      alert(`Error deleting package: ${err.message}`); // Show error message in alert box
      console.error("Error deleting package:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  // Function to close sidebar and form
  const handleOverlayClick = (e) => {
    // Stop propagation to prevent other click handlers from firing
    e.stopPropagation();
    setIsSidebarOpen(false);
    setIsFormOpen(false);
  };

  return (
    <div className="package-container">
      {/* Overlay to close sidebar/form */}
      {(isSidebarOpen || isFormOpen) && (
        <div
          className="overlay"
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999, // Ensure overlay is above other elements but below sidebar
          }}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarOpen ? "active" : ""}`}
        style={{ zIndex: 1000 }} // Ensure sidebar is above overlay
      >
        <div className="brand">Travel Admin</div>
        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/admin" className="nav-link" onClick={closeSidebar}>
              Overview
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user" className="nav-link" onClick={closeSidebar}>
              Manage Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/package" className="nav-link" onClick={closeSidebar}>
              Packages
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/payment" className="nav-link" onClick={closeSidebar}>
              Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link" onClick={closeSidebar}>
              Feedback
            </Link>
          </li>
        </ul>
        {/* Close button specifically for mobile */}
        {window.innerWidth <= 768 && (
          <button
            onClick={closeSidebar}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </div>
          <div className="user-info">Admin</div>
          <button className="create-button" onClick={toggleForm}>
            Create Package
          </button>
        </div>

        {/* Form */}
        {isFormOpen && (
          <div className="form-container">
            <h2>Create Package</h2>
            <label>Package Name</label>
            <input
              type="text"
              name="package_name"
              value={formData.package_name}
              onChange={handleInputChange}
              placeholder="Enter package name"
            />

            <label>Package Description</label>
            <textarea
              name="package_description"
              value={formData.package_description}
              onChange={handleInputChange}
              placeholder="Enter description"
            ></textarea>

            <label>Duration (in days)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Enter duration"
            />

            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
            />

            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
            />

            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
            />

            <label>Discount</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="Enter discount"
            />

            <label>Package Image</label>
            <input
              type="file"
              name="package_image"
              onChange={handleInputChange}
            />

            <button onClick={() => alert("Package Created!")}>Submit</button>
            <button onClick={toggleForm} className="close-button">
              Close
            </button>
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search packages..."
        />

        {/* Display Loading and Error Messages */}
        {loading && <p>Loading packages...</p>}
        {error && <p className="error">{error}</p>}

        {/* Table */}
        {!loading && !error && packages.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Package ID</th>
                <th>Package Name</th>
                <th>Duration</th>
                <th>Max Group Size</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Rating</th>
                <th>Rating Quality</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td data-label="Package ID">{pkg._id}</td>
                  <td data-label="Package Name">{pkg.name}</td>
                  <td data-label="Duration">{pkg.duration} days</td>
                  <td data-label="Duration">{pkg.maxGroupSize}</td>
                  <td data-label="Price">${pkg.price}</td>
                  <td data-label="Discount">${pkg.priceDiscount}</td>
                  <td data-label="Rating">{pkg.ratingAverage || "N/A"}</td>
                  <td data-label="Rating">{pkg.ratingQuantity}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${pkg.status}`}>
                      {pkg.status ? "Active" : "Not Active"}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <button className="edit-button">Edit</button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(pkg._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No packages found.</p>
        )}
      </main>
    </div>
  );
};

export default Package;
