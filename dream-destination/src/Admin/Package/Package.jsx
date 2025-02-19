import { useState, useEffect, useCallback } from "react";
import CreatePackageForm from "./CreatePackageForm";
import UpdatePackageForm from "./UpdatePackageForm";
import { Link, useNavigate } from "react-router-dom";
import "./Package.css";

const Package = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    startDate: "",
    endDate: "",
    status: "active",
    priceDiscount: "",
    maxGroupSize: "",
    imageCover: null,
  });

  const handleUpdate = async (formData) => {
    if (!isAdmin || !selectedPackage) {
      alert("Only admins can update packages");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/tours/${selectedPackage._id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Package Updated Successfully!");
        setIsUpdateFormOpen(false);
        setSelectedPackage(null);
        await fetchPackages(); // Refresh the packages list
      } else {
        const errorData = await response.json();
        alert(
          `Failed to update package: ${errorData.message || "Unknown error"}`
        );
        console.error("Server response:", errorData);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error updating package:", error);
    }
  };

  // Update the edit button click handler
  const handleEditClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsUpdateFormOpen(true);
  };

  // Fetch packages implementation using useCallback to prevent unnecessary re-renders
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/tours", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch packages with status: ${response.status}`
        );
      }
      const data = await response.json();
      setPackages(data.tours || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // First check if the user is an admin
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/me", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(
            `Authentication failed with status: ${response.status}`
          );
        }
        const data = await response.json();
        if (data.data && data.data.role === "admin") {
          setIsAdmin(true);
        } else {
          console.log("User is not an admin, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Authentication failed. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Only fetch packages if the user is confirmed as admin
  useEffect(() => {
    if (isAdmin) {
      fetchPackages();
    }
  }, [isAdmin, fetchPackages]);

  // Responsive sidebar management
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && isSidebarOpen) {
        const sidebar = document.querySelector(".sidebar");
        const menuToggle = document.querySelector(".menu-toggle");

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      setFormData({
        name: "",
        description: "",
        duration: "",
        price: "",
        startDate: "",
        endDate: "",
        status: "active",
        priceDiscount: "",
        maxGroupSize: "",
        imageCover: null,
      });
    }
  };

  // In Package.jsx
  const handleSubmit = async (formData) => {
    if (!isAdmin) {
      alert("Only admins can create packages");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/tours", {
        method: "POST",
        credentials: "include",
        body: formData, // Use the FormData directly
      });

      if (response.ok) {
        alert("Package Created Successfully!");
        toggleForm();
        await fetchPackages(); // Refresh the packages list
      } else {
        const errorData = await response.json();
        alert(
          `Failed to create package: ${errorData.message || "Unknown error"}`
        );
        console.error("Server response:", errorData);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error creating package:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert("Only admins can delete packages");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/tours/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete package: ${
            errorData.message || `Status: ${response.status}`
          }`
        );
      }

      alert("Package deleted successfully!");
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg._id !== id)
      );
    } catch (err) {
      alert(`Error deleting package: ${err.message}`);
      console.error("Error deleting package:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Function to close sidebar and form when overlay is clicked
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
    setIsFormOpen(false);
  };

  // Filter packages based on search query
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If there's an auth error, show it
  if (error && error.includes("Authentication failed")) {
    return (
      <div className="auth-error-container">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  // Show loading until auth check is done
  if (loading && !isAdmin) {
    return (
      <div className="loading-container">
        <p>Checking authorization...</p>
      </div>
    );
  }

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
            zIndex: 999,
          }}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarOpen ? "active" : ""}`}
        style={{ zIndex: 1000 }}
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
            <Link
              to="/package"
              className="nav-link active"
              onClick={closeSidebar}
            >
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
        {window.innerWidth <= 768 && (
          <button
            className="close-button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ✖
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰
          </div>
          <div className="user-info">Admin</div>
          <button className="create-button" onClick={toggleForm}>
            Create Package
          </button>
        </div>

        {/* Package Form */}
        {isFormOpen && (
          <CreatePackageForm onSubmit={handleSubmit} onCancel={toggleForm} />
        )}

        {/* Update Package Form */}
        {isUpdateFormOpen && (
          <UpdatePackageForm
            packageData={selectedPackage}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsUpdateFormOpen(false);
              setSelectedPackage(null);
            }}
          />
        )}

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display Loading and Error Messages */}
        {loading && <div className="loading">Loading packages...</div>}
        {error && !error.includes("Authentication failed") && (
          <div className="error-message">{error}</div>
        )}

        {/* Packages Table */}
        {!loading && !error && (
          <div className="table-container">
            {filteredPackages.length > 0 ? (
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
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td data-label="Package ID">{pkg._id}</td>
                      <td data-label="Package Name">{pkg.name}</td>
                      <td data-label="Duration">{pkg.duration} days</td>
                      <td data-label="Max Group Size">
                        {pkg.maxGroupSize || "N/A"}
                      </td>
                      <td data-label="Price">${pkg.price.toFixed(2)}</td>
                      <td data-label="Discount">
                        {pkg.priceDiscount
                          ? `$${pkg.priceDiscount.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td data-label="Rating">
                        {pkg.ratingAverage
                          ? pkg.ratingAverage.toFixed(1)
                          : "N/A"}
                      </td>
                      <td data-label="Rating Quantity">
                        {pkg.ratingQuantity || 0}
                      </td>
                      <td data-label="Status">
                        <span
                          className={`status-badge ${pkg.status || "inactive"}`}
                        >
                          {pkg.status === true ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td data-label="Actions" className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(pkg)}
                        >
                          Edit
                        </button>
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
              <p className="no-data">No packages found matching your search.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Package;
