const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// get all booking
exports.getAllBooking = catchAsync(async (req, res, next) => {
  const getBookings = await Booking.find().populate("tour user");

  if (!getBookings) {
    return next(new AppError("There is not booking", 400));
  }
  res.status(200).json({
    status: "success",
    data: getBookings,
  });
});

// create booking
exports.createBooking = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const userId = req.user.id;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError("Tour does not exists", 400));
  }

  const booking = await Booking.create({ tour: tourId, user: userId });

  res.status(200).json({
    status: "success",
    data: booking,
  });
});

// get all booking
exports.getBooking = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const booking = await Booking.findById(tourId).populate("tour user");

  if (!booking) {
    return next(new AppError("Booking does not exists", 400));
  }

  res.status(200).json({
    status: "success",
    data: booking,
  });
});
