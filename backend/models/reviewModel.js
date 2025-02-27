const mongoose = require("mongoose");
// const moment = require("moment-timezone");

// review schema
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Tour must have review"],
    },
    rating: {
      type: Number,
      min: [1, "Tour must have min rating of 1"],
      max: [5, "Tour must have max rating of 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be belong to user"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must be belong to tour"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//  user can create one time review on specific tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// generate readable format dates
reviewSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toDateString();
});

// Get username when searching of specific review or reviews
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  }).populate({
    path: "tour",
    select: "name",
  });

  next();
});

// update tour rating when create,update and delete reviews
reviewSchema.statics.updateTourStats = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Tour").findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].numReviews,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await mongoose.model("Tour").findByIdAndUpdate(tourId, {
      reviewsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// update tour rating when creating a new review on specific tour
reviewSchema.post("save", function () {
  this.constructor.updateTourStats(this.tour);
});

// update tour rating when updating or deleting a review
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.model("Review").updateTourStats(doc.tour);
  }
});

// get overAll reviews
reviewSchema.statics.getOverallReviews = async function () {
  const overallReviews = await this.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgReview: { $avg: "$rating" },
      },
    },
  ]);

  return {
    totalReviews: overallReviews[0].totalReviews,
    averageRating: overallReviews[0].averageRating.toFixed(2),
  };
};

// create a model outof schema
const Review = mongoose.model("Review", reviewSchema);

// exports Review model
module.exports = Review;
