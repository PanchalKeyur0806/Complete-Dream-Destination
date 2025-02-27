const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const SearchHelper = require("../utils/searchHelper");

//  get all users
exports.getAllUser = catchAsync(async (req, res, next) => {
  const searchQuery = new SearchHelper(User.find(), req.query).searchByField(
    "name"
  );
  const users = await searchQuery.query;

  if (!users) {
    return next(new AppError("No user found", 400));
  }

  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
});

exports.totalActiveUser = catchAsync(async (req, res, next) => {
  const allUsers = await User.totalUsers();

  if (!allUsers) {
    return next(new AppError("There are no users found", 400));
  }

  res.status(200).json({
    status: "success",
    allUsers,
  });
});
