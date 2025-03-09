// installed modules
const express = require("express");
// custom modules
const hotelController = require("../controller/hotelController");
const authController = require("../controller/authController");

const routes = express.Router();

// only admin can access this route
routes.use(authController.protect, authController.restrictTo("admin"));

routes
  .route("/")
  .get(hotelController.getAllHotel)
  .post(hotelController.createHotel);

routes.route("/:id").get(hotelController.getHotel).delete(hotelController.deleteHotel)

module.exports = routes;
