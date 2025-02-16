import React, { useState } from 'react'
import './Feedback.css'
import { Link } from 'react-router-dom'



const Feedback = ()=> {
    const [Active,SetActive] = useState(false);

    const menuToggle =()=>{
        SetActive(Active);
    }
  return (
    <><div className="overlay"></div><aside className="sidebar">
          <div className="brand">
              Travel Admin
          </div>
          <ul className={Active}>
              <li className="nav-item">
                  <Link to="/admin" className="nav-link">
                      <i className="fas fa-chart-line"></i>
                      Overview
                  </Link>
              </li>
              <li className="nav-item">
                  <Link to='/user' className="nav-link">
                      <i className="fas fa-users"></i>
                      Manage Users
                  </Link>
              </li>
              <li className="nav-item">
              <Link to='/package' className="nav-link">
                      <i className="fas fa-box"></i>
                      Packages
                  </Link>
              </li>
              <li className="nav-item">
              <Link to='/payment' className="nav-link">
                      <i className="fas fa-credit-card"></i>
                      Payments
                  </Link>
              </li>
              <li className="nav-item">
              <Link to='/feedback' className="nav-link active">
                      <i className="fas fa-comments"></i>
                      Feedback
                  </Link>
              </li>
          </ul>
      </aside><main className="main-content">
              <div className="header">
                  <div className="menu-toggle" onClick={menuToggle}>
                      <i className="fas fa-bars"></i>
                  </div>
                  <div className="user-info">
                      <i className="fas fa-user"></i>
                      Admin
                  </div>
              </div>

              <div className="table-container">
                  <h2>Feedbacks</h2>
                  <table>
                      <thead>
                          <tr>
                              <th>Feedback ID</th>
                              <th>User</th>
                              <th>Package Name</th>
                              <th>Feedback</th>
                              <th>Rating</th>
                              <th>Date</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr data-feedback-id="FB001" data-user-name="John Doe" data-user-email="john.doe@example.com"
                              data-package="Luxury Beach Package" data-full-feedback="Amazing experience, highly recommended!"
                              data-rating="5" data-date="2025-01-15">
                              <td data-label="Feedback ID">FB001</td>
                              <td data-label="User">John Doe</td>
                              <td data-label="Package Name">Luxury Beach Package</td>
                              <td data-label="Feedback">Amazing experience, highly recommended!</td>
                              <td data-label="Rating">5/5</td>
                              <td data-label="Date">2025-01-15</td>
                              <td data-label="Actions">
                                  <div className="action-buttons">
                                      <button className="edit-button view-feedback">View</button>
                                      <button className="delete-button">Delete</button>
                                  </div>
                              </td>
                          </tr>
                          <tr data-feedback-id="FB002" data-user-name="Jane Smith" data-user-email="jane.smith@example.com"
                              data-package="Mountain Adventure" data-full-feedback="Great package, but challenging terrain"
                              data-rating="4" data-date="2025-01-20">
                              <td data-label="Feedback ID">FB002</td>
                              <td data-label="User">Jane Smith</td>
                              <td data-label="Package Name">Mountain Adventure</td>
                              <td data-label="Feedback">Great package, but challenging terrain</td>
                              <td data-label="Rating">4/5</td>
                              <td data-label="Date">2025-01-20</td>
                              <td data-label="Actions">
                                  <div className="action-buttons">
                                      <button className="edit-button view-feedback">View</button>
                                      <button className="delete-button">Delete</button>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </main><div className="feedback-modal">
              <div className="feedback-modal-content">
                  <div className="modal-header">
                      <h2>Feedback Details</h2>
                      <button className="modal-close">&times;</button>
                  </div>
                  <div className="modal-body">
                      <div className="feedback-detail">
                          <label>Feedback ID:</label>
                          <span className="feedback-id"></span>
                      </div>
                      <div className="feedback-detail">
                          <label>User Name:</label>
                          <span className="user-name"></span>
                      </div>
                      <div className="feedback-detail">
                          <label>User Email:</label>
                          <span className="user-email"></span>
                      </div>
                      <div className="feedback-detail">
                          <label>Package:</label>
                          <span className="package-name"></span>
                      </div>
                      <div className="feedback-detail full-feedback">
                          <label>Feedback:</label>
                          <p className="feedback-text"></p>
                      </div>
                      <div className="feedback-detail">
                          <label>Rating:</label>
                          <div className="rating-display"></div>
                      </div>
                      <div className="feedback-detail">
                          <label>Date:</label>
                          <span className="feedback-date"></span>
                      </div>
                  </div>
                  <div className="modal-footer">
                      <button className="btn btn-secondary modal-close">Close</button>
                      <button className="btn btn-primary mark-resolved">Mark as Resolved</button>
                  </div>
              </div>
          </div></>

  )
}

export default Feedback