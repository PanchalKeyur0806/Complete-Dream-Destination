import React, { useState } from "react";
import "./ContactForm.css"; // Make sure to create this CSS file

const ContactForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 4) {
      newErrors.subject = "Subject should have at least 4 characters";
    } else if (formData.subject.length > 40) {
      newErrors.subject = "Subject should not exceed 40 characters";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        setSubmitStatus("success");
        // Add your API call here
        console.log("Form submitted:", formData);
      } catch (error) {
        setSubmitStatus("error");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2 className="form-title">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`form-input ${errors.subject ? "error" : ""}`}
              placeholder="Enter subject (4-40 characters)"
            />
            {errors.subject && (
              <p className="error-message">{errors.subject}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`form-textarea ${errors.message ? "error" : ""}`}
              placeholder="Enter your message"
            />
            {errors.message && (
              <p className="error-message">{errors.message}</p>
            )}
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        {submitStatus === "success" && (
          <div className="success-message">
            <p>Success!</p>
            <p>Your message has been sent successfully!</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="error-alert">
            <p>Error</p>
            <p>There was an error sending your message. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
