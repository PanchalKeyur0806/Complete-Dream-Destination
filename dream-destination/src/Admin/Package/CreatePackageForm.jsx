import React, { useState, useEffect } from "react";

const CreatePackageForm = ({ onSubmit, onCancel }) => {
  const [guides, setGuides] = useState([]);

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
      coordinates: ["", ""], // [longitude, latitude]
    },
    hotel: "",
    guides: [], // <-- Fix: Store guides as an array
    status: true,
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/users/tour-guide", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch guides");
        return response.json();
      })
      .then((data) => {
        console.log("Guides fetched:", data);
        setGuides(data.data); // Assuming API response has { data: guidesArray }
      })
      .catch((error) => console.error("Error fetching guides:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === "longitude" || name === "latitude") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates:
            name === "longitude"
              ? [value, prev.location.coordinates[1]]
              : [prev.location.coordinates[0], value],
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGuideSelection = (e) => {
    const selectedGuideId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      guides: selectedGuideId ? [selectedGuideId] : [], // Store as an array
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("duration", formData.duration);
    form.append("maxGroupSize", formData.maxGroupSize);
    form.append("price", formData.price);

    if (formData.priceDiscount) {
      form.append("priceDiscount", formData.priceDiscount);
    }

    form.append("startDate", formData.startDate);
    form.append("endDate", formData.endDate);

    // Convert location to JSON string
    const locationData = {
      coordinates: [
        Number(formData.location.coordinates[0]),
        Number(formData.location.coordinates[1]),
      ],
    };
    form.append("location", JSON.stringify(locationData));

    // Image file
    if (formData.imageCover) {
      form.append("imageCover", formData.imageCover);
    }

    // Fix: Append guides as a properly formatted array
    if (formData.guides.length > 0) {
      formData.guides.forEach((guide) => {
        form.append("guides[]", guide); // Each guide ID is sent separately
      });
    }

    if (formData.hotel) {
      form.append("hotel", formData.hotel);
    }

    if (typeof onSubmit === "function") {
      onSubmit(form);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Package</h2>
      <form onSubmit={handleSubmit}>
        {/* Rest of your form JSX remains the same */}
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
            placeholder="Enter package name"
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
            placeholder="Enter description"
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
              placeholder="Enter duration"
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
              placeholder="Enter max group size"
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
              placeholder="Enter price"
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
              placeholder="Enter discount"
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
            <label htmlFor="longitude">
              Longitude <span className="required">*</span>
            </label>
            <input
              id="longitude"
              type="number"
              name="longitude"
              value={formData.location.coordinates[0]}
              onChange={handleInputChange}
              placeholder="Enter longitude"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">
              Latitude <span className="required">*</span>
            </label>
            <input
              id="latitude"
              type="number"
              name="latitude"
              value={formData.location.coordinates[1]}
              onChange={handleInputChange}
              placeholder="Enter latitude"
              step="any"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="hotel">Hotel ID</label>
          <input
            id="hotel"
            type="text"
            name="hotel"
            value={formData.hotel}
            onChange={handleInputChange}
            placeholder="Enter hotel ID"
          />
        </div>

        <div>
          <label>Select a Guide:</label>
          <select
            onChange={handleGuideSelection}
            value={formData.guides[0] || ""}
          >
            <option value="">-- Select a Guide --</option>
            {guides.map((guide) => (
              <option key={guide._id} value={guide._id}>
                {guide.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imageCover">
            Package Image <span className="required">*</span>
          </label>
          <input
            id="imageCover"
            type="file"
            name="imageCover"
            onChange={handleInputChange}
            accept="image/*"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Package
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePackageForm;
