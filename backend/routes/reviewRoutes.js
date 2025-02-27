// installed modules
const express = require("express");
// custom modules
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");
const bookingController = require("../controller/bookingController");

const routes = express.Router({ mergeParams: true });

routes.get("/totalreviews", reviewController.overAllReviews);
routes.route("/").get(reviewController.getAllReview);

routes.use(authController.protect);

routes
  .route("/")
  .post(
    authController.protect,
    bookingController.checkIfUserBookedTour,
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview
  );

routes
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = routes;
