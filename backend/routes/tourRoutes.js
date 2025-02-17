const express = require("express");
const reviewRouter = require("./reviewRoutes");
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");

const routes = express.Router();
//
routes.use("/:tourId/reviews", reviewRouter);

//

routes
  .route("/")
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.uploadImages,
    tourController.createTour
  );

routes
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.uploadImages,
    tourController.updateTour
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("admin"),
    tourController.deleteTour
  );

module.exports = routes;
