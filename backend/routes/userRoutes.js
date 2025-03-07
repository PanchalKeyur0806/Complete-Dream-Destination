const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const routes = express.Router();

// toatlUsers
routes.get("/totalusers", userController.totalActiveUser);
routes.get("/findbookedtour", authController.protect, userController.fetchBookedTourByUser)

// forget password and reset password
// for anyone
routes.route("/forgotpassword").post(authController.forgetPassword);
routes.route("/resetpassword/:token").patch(authController.resetPassword);

// for authenticating user
routes.route("/signup").post(authController.signUp);
routes.route("/login").post(authController.login);
routes.route("/logout").post(authController.logout);
routes.route("/me").get(authController.protect, authController.me);

// for signup tour-guide
// only admin can create tour guide
routes
  .route("/tour-guide")
  .post(authController.tourGuide)
  .get(userController.fetchTourGuides);

// get all user
// only admin can access this route
routes.use(authController.protect, authController.restrictTo("admin"));
routes.route("/").get(userController.getAllUser);

module.exports = routes;
