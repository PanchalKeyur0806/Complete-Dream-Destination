import axios from "axios";
import "./Api.css";

const API_URL = "http://localhost:8000/api/tours";

// GET all tours
export const getTours = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.tours;
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
};

// GET single tour by ID
export const getTourById = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/tours/${id}`); // Fetch single tour
    const data = await res.json();
    return data.data.tour;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
};

// CREATE a new tour
export const createTour = async (tourData) => {
  try {
    const response = await axios.post(API_URL, tourData, {
      headers: {
        "Content-Type": "multipart/form-data", // Since we are uploading an image
      },
    });
    return response.data.newTour;
  } catch (error) {
    console.error("Error creating tour:", error);
    return null;
  }
};

// UPDATE a tour
export const updateTour = async (id, tourData) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, tourData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.updatedTour;
  } catch (error) {
    console.error("Error updating tour:", error);
    return null;
  }
};

// DELETE a tour
export const deleteTour = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data.deletedTour;
  } catch (error) {
    console.error("Error deleting tour:", error);
    return null;
  }
};
