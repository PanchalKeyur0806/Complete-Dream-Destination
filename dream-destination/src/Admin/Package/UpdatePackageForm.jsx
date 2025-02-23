import React, { useState, useEffect } from "react";

const UpdatePackageForm = ({ packageData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    maxGroupSize: "",
    price: "",
    priceDiscount: "",
    startDate: "",
    endDate: "",
    imageCover: null,
    location: {
      type: "Point",
      coordinates: ["", ""],
    },
    hotel: "",
    status: true,
  });

  useEffect(() => {
    if (packageData) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        name: packageData.name || "",
        description: packageData.description || "",
        duration: packageData.duration || "",
        maxGroupSize: packageData.maxGroupSize || "",
        price: packageData.price || "",
        priceDiscount: packageData.priceDiscount || "",
        startDate: formatDate(packageData.startDate) || "",
        endDate: formatDate(packageData.endDate) || "",
        imageCover: null,
        location: packageData.location || {
          type: "Point",
          coordinates: ["", ""],
        },
        hotel: packageData.hotel || "",
        status: packageData.status ?? true,
      });
    }
  }, [packageData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (name === "coordinates[0]" || name === "coordinates[1]") {
      // Updated coordinate handling
      const index = name === "coordinates[0]" ? 0 : 1;
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: prev.location.coordinates.map((coord, i) =>
            i === index ? value : coord
          ),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append all form fields except location
    Object.keys(formData).forEach((key) => {
      if (
        key !== "location" &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        form.append(key, formData[key]);
      }
    });

    form.append("location[type]", "Point");
    form.append(
      "location[coordinates][]",
      formData.location.coordinates[0] || ""
    );
    form.append(
      "location[coordinates][]",
      formData.location.coordinates[1] || ""
    );

    onSubmit(form);
  };

  return (
    <div className="form-container">
      <h2>Update Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Package Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            minLength="5"
            maxLength="40"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Package Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">
              Duration (days) <span className="required">*</span>
            </label>
            <input
              id="duration"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxGroupSize">
              Max Group Size <span className="required">*</span>
            </label>
            <input
              id="maxGroupSize"
              type="number"
              name="maxGroupSize"
              value={formData.maxGroupSize}
              onChange={handleInputChange}
              min="1"
              max="15"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">
              Price <span className="required">*</span>
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priceDiscount">Price Discount</label>
            <input
              id="priceDiscount"
              type="number"
              name="priceDiscount"
              value={formData.priceDiscount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">
              Start Date <span className="required">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              End Date <span className="required">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="coordinates[0]">
              Longitude <span className="required">*</span>
            </label>
            <input
              id="coordinates[0]"
              type="number"
              name="coordinates[0]"
              value={formData.location.coordinates[0]}
              onChange={handleInputChange}
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coordinates[1]">
              Latitude <span className="required">*</span>
            </label>
            <input
              id="coordinates[1]"
              type="number"
              name="coordinates[1]"
              value={formData.location.coordinates[1]}
              onChange={handleInputChange}
              step="any"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageCover">Package Image</label>
          <input
            id="imageCover"
            type="file"
            name="imageCover"
            onChange={handleInputChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Package
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePackageForm;
