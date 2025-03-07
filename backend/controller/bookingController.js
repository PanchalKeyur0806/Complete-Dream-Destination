const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
  const { _id, email } = req.user;
  const { numberOfGuests } = req.body;

  if (!tourId || !_id || !numberOfGuests) {
    return next(new AppError("Missing required fields", 400));
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError("Tour does not exist", 400));
  }

  const priceDiscount = tour.price - tour.priceDiscount;
  console.log("Price discount is ...........", priceDiscount);

  // Check if tour has already started
  let currentDate = new Date();
  if (new Date(tour.startDate) <= currentDate) {
    return next(
      new AppError(
        "You can't book this tour because it has already started",
        400
      )
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    metadata: {
      tourId,
      userId: _id.toString(),
      numberOfGuests,
    },
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: tour.name,
          },
          unit_amount: priceDiscount * 100, // Convert to paise
        },
        quantity: numberOfGuests, // Ensure guests are considered
      },
    ],
    success_url: `http://localhost:5173/booking-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5173/cancel`,
  });

  res.status(200).json({
    status: "success",
    url: session.url, // Return only the session URL
  });
});

// const create a booking after payment
const createBookingAfterPayment = async (req, res, next) => {
  const { tourId, userId, numberOfGuests } = session.metadata;

  await Booking.create({
    tour: tourId,
    user: userId,
    numberOfGuests,
    paymentId: session.id,
    status: "confirmed",
  });
};

//
exports.webhookHandler = catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: `webhook error ${err.message}` });
  }

  if (event.type === `checkout.session.completed`) {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      await this.createBookingAfterPayment(session);
    }
  }

  res.status(200).json({ status: "success", received: true });
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

// verify the payment
// Add this to your bookingController.js file
// Corrected controller function
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return next(new AppError("Session ID is required", 400));
  }

  // Retrieve the session from Stripe to verify its status
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    return next(new AppError("Invalid session ID", 404));
  }

  // Check if payment was successful
  if (session.payment_status !== "paid") {
    return next(new AppError("Payment has not been completed", 400));
  }

  // Find the booking associated with this payment
  const booking = await Booking.findOne({ paymentId: sessionId }).populate({
    path: "tour",
    select: "name",
  });

  if (!booking) {
    // If webhook hasn't processed yet, create the booking now
    if (
      session.metadata &&
      session.metadata.tourId &&
      session.metadata.userId
    ) {
      const newBooking = await Booking.create({
        tour: session.metadata.tourId,
        user: session.metadata.userId,
        numberOfGuests: session.metadata.numberOfGuests,
        paymentId: session.id,
        status: "confirmed",
      });

      // Populate the tour information
      const populatedBooking = await Booking.findById(newBooking._id).populate({
        path: "tour",
        select: "name",
      });

      return res.status(200).json({
        status: "success",
        booking: populatedBooking,
      });
    }

    return next(new AppError("Booking not found", 404));
  }

  res.status(200).json({ status: "success", booking });
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

  next();
});

// TOTAL REVENUE OF BOOKING
exports.totalRevenue = catchAsync(async (req, res, next) => {
  const revenue = await Booking.getTotalRevenue();

  res.status(200).json({
    status: "success",
    data: {
      revenue,
    },
  });
});
