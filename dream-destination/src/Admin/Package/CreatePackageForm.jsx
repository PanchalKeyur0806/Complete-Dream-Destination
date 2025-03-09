import React, { useState, useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
// Import marker icons manually since Leaflet's default handling doesn't work well with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CreatePackageForm = ({ onSubmit, onCancel }) => {
  const [guides, setGuides] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

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
    guides: [], // Store guides as an array
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

  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      try {
        // Initialize the map with OpenStreetMap
        mapRef.current = L.map(mapContainerRef.current).setView([28.6139, 77.209], 9); // Default to Delhi, India

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);

        // Add zoom controls
        L.control.zoom({
          position: 'topright'
        }).addTo(mapRef.current);

        console.log("Map loaded successfully");
        setMapLoaded(true);

        // Click event to set marker and update coordinates
        mapRef.current.on("click", (e) => {
          const { lat, lng } = e.latlng;
          console.log(`Selected coordinates: ${lng.toFixed(6)}, ${lat.toFixed(6)}`);

          // Update form data with clicked coordinates
          // Note: OpenStreetMap uses [lat, lng] but we're storing [lng, lat] to match your original format
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [lng.toFixed(6), lat.toFixed(6)],
            },
          }));

          // Remove existing marker if it exists
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng], {
            draggable: true // Make the marker draggable for fine adjustment
          })
            .addTo(mapRef.current)
            .on('dragend', function (event) {
              // Update coordinates after dragging
              const marker = event.target;
              const position = marker.getLatLng();
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  coordinates: [position.lng.toFixed(6), position.lat.toFixed(6)],
                },
              }));
            });
        });

        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Failed to initialize map. Please check your internet connection.");
      }
    }
  }, []);

  // Update marker position when coordinates change directly in the input fields
  useEffect(() => {
    const lng = parseFloat(formData.location.coordinates[0]);
    const lat = parseFloat(formData.location.coordinates[1]);

    if (mapRef.current && mapLoaded && !isNaN(lng) && !isNaN(lat)) {
      // Remove existing marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker at the specified coordinates
      markerRef.current = L.marker([lat, lng], {
        draggable: true
      })
        .addTo(mapRef.current)
        .on('dragend', function (event) {
          // Update coordinates after dragging
          const marker = event.target;
          const position = marker.getLatLng();
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [position.lng.toFixed(6), position.lat.toFixed(6)],
            },
          }));
        });

      // Center the map on the marker
      mapRef.current.setView([lat, lng], 10);
    }
  }, [formData.location.coordinates, mapLoaded]);

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
    if (formData.endDate) {
      form.append("endDate", formData.endDate);
    }

    // Convert location to JSON string
    const locationData = {
      type: "Point",
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

    if (typeof onSubmit === "function") {
      onSubmit(form);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Package</h2>
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
        </div>

        <div className="form-group">
          <label>
            Select Location <span className="required">*</span>
          </label>
          <div
            ref={mapContainerRef}
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "4px",
              marginBottom: "15px",
              border: "1px solid #ccc"
            }}
          ></div>
          {mapError && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{mapError}</div>}
          <p className="map-instruction">Click on the map to select a location (marker is draggable for precise positioning)</p>
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