// installed modules
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
// custom modules
const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// set tour and user id when, they are not specified
// this is middleware that run before creating reviews
exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;

  if (!req.body.user) {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    req.body.user = decoded.id;
  }

  if (!req.body.tour || !req.body.user) {
    return res.status(400).json({ message: "Missing tourId or userId" });
  }

  next();
};

// formating reviews at IST time
const formatReviews = (review) => {
  return {
    ...review.toObject(),
    createdAtIst: moment(review.createdAt)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss"),
    userName: review.user?.name,
    tourName: review.tour?.name,
  };
};

// get all reviews
exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    return next(new AppError("Reviews not found", 400));
  }

  const formatedReviews = reviews.map(formatReviews);

  res.status(200).json({
    status: "success",
    length: formatedReviews.length,
    data: formatedReviews,
  });
});

// get review
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review does not exists", 404));
  }

  const formatedReviews = formatReviews(review);

  res.status(200).json({
    status: "success",
    data: formatedReviews,
  });
});

// creating review
exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;

  const newReview = await Review.create({
    review,
    rating,
    tour,
    user,
  });

  res.status(200).json({
    status: "success",
    data: {
      newReview,
    },
  });
});

// updating the review
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  const allowedFileds = {
    review: req.body.review,
    rating: req.body.rating,
  };

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  const updateReview = await Review.findByIdAndUpdate(
    req.params.id,
    allowedFileds,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    updateReview,
  });
});

// Delete specific review
exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
