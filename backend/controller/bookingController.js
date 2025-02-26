const crypto = require("crypto");
const moment = require("moment-timezone");
const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const SearchHelper = require("../utils/searchHelper");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const formatBooking = (booking) => {
  return {
    ...booking.toObject(),
    createdAtIst: moment(booking.bookingAt)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss"),
  };
};
// get all booking
exports.getAllBooking = catchAsync(async (req, res, next) => {
  const searchQuery = new SearchHelper(Booking.find(), req.query).filterByDate(
    "bookingAt"
  );

  const getBookings = await searchQuery.query;

  const formatedBooking = getBookings.map(formatBooking);

  if (!getBookings) {
    return next(new AppError("There is not booking", 400));
  }
  res.status(200).json({
    status: "success",
    length: getBookings.length,
    data: formatedBooking,
  });
});

// create booking
exports.createBooking = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const userId = req.user.id;
  const { numberOfGuests } = req.body;

  let paymentId;
  let isUnique = false;

  while (!isUnique) {
    paymentId = "PAY -" + crypto.randomBytes(8).toString("hex");
    const existingBooking = await Booking.findOne({ paymentId });

    if (!existingBooking) isUnique = true;
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError("Tour does not exists", 400));
  }

  const booking = await Booking.create({
    tour: tourId,
    user: userId,
    numberOfGuests: numberOfGuests,
    paymentId: paymentId,
    status: "confirmed",
  });

  res.status(200).json({
    status: "success",
    data: booking,
  });
});

// get all booking
exports.getBooking = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const booking = await Booking.findById(tourId);

  if (!booking) {
    return next(new AppError("Booking does not exists", 400));
  }
  const formatedBooking = formatBooking(booking);

  res.status(200).json({
    status: "success",
    data: formatedBooking,
  });
});

// In your backend (bookingController.js)
exports.checkExistingBooking = catchAsync(async (req, res, next) => {
  const { tourId, userId } = req.params;
  // const userId = req.user.id;

  const existingBooking = await Booking.findOne({ user: userId, tour: tourId });
  console.log(existingBooking);

  if (existingBooking) {
    return res
      .status(200)
      .json({ alreadyBooked: true, bookingId: existingBooking._id });
  }

  res.status(200).json({ alreadyBooked: false });
});

// cancel booking
exports.handleCancelBooking = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { tourId } = req.params;

  const booking = await Booking.findOne({ user: _id, tour: tourId });
  if (!booking) {
    return next(new AppError("There is no booking created", 400));
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError("There is no tour found", 400));
  }

  const today = new Date().toISOString().split("T")[0];
  const tourStartDate = new Date(tour.startDate).toISOString().split("T")[0];

  if (tourStartDate === today) {
    return next(new AppError("you can't cancel tour on start date", 400));
  }

  await Booking.findOneAndDelete({ _id: booking._id });

  res.status(204).json({
    status: "success",
    message: "Booking canceled successfully",
  });
});

exports.checkIfUserBookedTour = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const tourId = req.params.tourId;

  const booking = await Booking.findOne({ user: userId, tour: tourId });
  if (!booking) {
    return next(new AppError("You need Book this tour in order to reivew"));
  }

  next()
});
