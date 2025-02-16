const express = require("express");
const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");

const routes = express.Router();

routes.use(authController.protect);

routes
  .route("/")
  .get(authController.restrictTo("admin"), bookingController.getAllBooking);
routes
  .route("/:tourId")
  .get(authController.restrictTo("admin"), bookingController.getBooking)
  .post(bookingController.createBooking);

module.exports = routes;
