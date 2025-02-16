import { useState } from "react";
import { Link } from "react-router-dom";
import "./Package.css";

const Package = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  return (
    <div className="package-container">
      {/* Overlay to close sidebar/form */}
      { (isSidebarOpen || isFormOpen) && (
        <div className="overlay" onClick={() => {
          setIsSidebarOpen(false);
          setIsFormOpen(false);
        }}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="brand">Travel Admin</div>
        <ul className="nav-items">
          <li className="nav-item"><Link to="/admin" className="nav-link">Overview</Link></li>
          <li className="nav-item"><Link to="/user" className="nav-link">Manage Users</Link></li>
          <li className="nav-item"><Link to="/package" className="nav-link">Packages</Link></li>
          <li className="nav-item"><Link to="/payment" className="nav-link">Payments</Link></li>
          <li className="nav-item"><Link to="/feedback" className="nav-link">Feedback</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div className="menu-toggle" onClick={toggleSidebar}>☰</div>
          <div className="user-info">Admin</div>
          <button className="create-button" onClick={toggleForm}>Create Package</button>
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
            <button onClick={toggleForm} className="close-button">Close</button>
          </div>
        )}

        {/* Search Bar */}
        <input type="text" className="search-bar" placeholder="Search packages..." />

        {/* Table */}
        <table>
          <thead>
            <tr>
              <th>Package ID</th>
              <th>Package Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Rating</th>
              <th>Total Ratings</th>
              <th>Created Date</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Add rows dynamically here */}
        </table>
      </main>
    </div>
  );
};

export default Package;
