const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//  get all users
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError("No user found", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
