const express = require("express");
const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");

const routes = express.Router();

routes.use(authController.protect);

routes.route("/totalrevenue").get(bookingController.totalRevenue);

routes
  .route("/")
  .get(authController.restrictTo("admin"), bookingController.getAllBooking);
routes
  .route("/:tourId")
  .get(bookingController.getBooking)
  .post(authController.restrictTo("user"), bookingController.createBooking);

routes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  bookingController.webhookHandler
);

// verify payment route
routes.get(
  "/verify-payment/:sessionId",
  authController.protect,
  bookingController.verifyPayment
);

routes.get(
  "/check-booking/:userId/:tourId",
  bookingController.checkExistingBooking
);

routes
  .route("/cancel/:tourId")
  .delete(authController.protect, bookingController.handleCancelBooking);

module.exports = routes;
