import React, { useState, useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UpdatePackageForm = ({ packageData, onSubmit, onCancel }) => {
  const [guides, setGuides] = useState([]);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    maxGroupSize: "",
    price: "",
    priceDiscount: "",
    startDate: "",
    imageCover: null,
    location: {
      type: "Point",
      coordinates: ["", ""],
    },
    hotel: "",
    guides: [],
    status: true,
  });

  // Fetch tour guides
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
        setGuides(data.data);
      })
      .catch((error) => console.error("Error fetching guides:", error));
  }, []);

  // Initialize the map only once after component mounts
  useEffect(() => {
    // Only initialize if mapRef exists and map isn't already initialized
    if (mapRef.current && !leafletMapRef.current) {
      // Default view if no coordinates are provided
      const defaultLat = 27.7172;
      const defaultLng = 85.3240; // Default to Kathmandu
      const defaultZoom = 13;

      // Initialize map
      leafletMapRef.current = L.map(mapRef.current).setView(
        [defaultLat, defaultLng],
        defaultZoom
      );

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);

      // Add click event to set marker on map click
      leafletMapRef.current.on('click', handleMapClick);
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off('click');
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update map when packageData changes
  useEffect(() => {
    if (packageData && leafletMapRef.current) {
      const lng = parseFloat(packageData.location?.coordinates[0]);
      const lat = parseFloat(packageData.location?.coordinates[1]);

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        // Update form coordinates
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [lng.toString(), lat.toString()]
          }
        }));

        // Center map on package location
        leafletMapRef.current.setView([lat, lng], 13);

        // Add or update marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(leafletMapRef.current);
        }
      }
    }
  }, [packageData]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;

    // Update form data coordinates
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: [lng.toString(), lat.toString()]
      }
    }));

    // Add or update marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(leafletMapRef.current);
    }
  };

  const handleGuideSelection = (e) => {
    const selectedGuideId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      guides: selectedGuideId ? [selectedGuideId] : [],
    }));
  };

  useEffect(() => {
    if (packageData) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
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
        imageCover: null,
        location: packageData.location || {
          type: "Point",
          coordinates: ["", ""],
        },
        hotel: packageData.hotel || "",
        guides:
          packageData.guides && packageData.guides.length > 0
            ? [packageData.guides[0]._id || packageData.guides[0]]
            : [],
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

      // Update form data
      setFormData((prev) => {
        const newCoordinates = [...prev.location.coordinates];
        newCoordinates[index] = value;

        return {
          ...prev,
          location: {
            ...prev.location,
            coordinates: newCoordinates,
          },
        };
      });

      // Update map marker if both coordinates are valid
      if (
        formData.location.coordinates[0] &&
        formData.location.coordinates[1] &&
        leafletMapRef.current
      ) {
        const lng = index === 0 ? value : formData.location.coordinates[0];
        const lat = index === 1 ? value : formData.location.coordinates[1];

        if (!isNaN(parseFloat(lng)) && !isNaN(parseFloat(lat))) {
          leafletMapRef.current.setView([parseFloat(lat), parseFloat(lng)], 13);

          if (markerRef.current) {
            markerRef.current.setLatLng([parseFloat(lat), parseFloat(lng)]);
          } else {
            markerRef.current = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(leafletMapRef.current);
          }
        }
      }
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
        key !== "guides" &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        form.append(key, formData[key]);
      }
    });

    // Handle guides properly
    if (formData.guides && formData.guides.length > 0) {
      form.append("guides", formData.guides[0]);
    }

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
        </div>

        {/* Leaflet Map */}
        <div className="form-group">
          <label>
            Location (Click on map to set coordinates) <span className="required">*</span>
          </label>
          <div id="map" ref={mapRef} style={{ height: "400px", width: "100%", marginBottom: "20px" }}></div>
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
          <label htmlFor="guide">Select a Guide:</label>
          <select
            id="guide"
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