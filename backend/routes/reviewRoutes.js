// installed modules
const express = require("express");
// custom modules
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

const routes = express.Router({ mergeParams: true });

routes.use(authController.protect);

routes
  .route("/")
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview
  )
  .get(reviewController.getAllReview);

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
