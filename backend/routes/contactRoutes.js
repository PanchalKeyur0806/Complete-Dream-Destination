// installed modules
const express = require("express");
// custom modules
const contactController = require("../controller/contactController");
const authController = require("../controller/authController");

// use routes for routing
const routes = express.Router();

// middleware for protecting anauthorized users
routes.use(authController.protect);

// get and create contacts
routes
  .route("/")
  .get(authController.restrictTo("admin"), contactController.getAllContacts)
  .post(authController.restrictTo("user"), contactController.createContacts);

// delete contacts
// only admin can delete this
routes
  .route("/:id")
  .delete(authController.restrictTo("admin"), contactController.deleteContact);

module.exports = routes;
