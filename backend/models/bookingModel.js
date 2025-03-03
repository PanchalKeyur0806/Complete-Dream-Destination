const mongoose = require("mongoose");
const Tour = require("./tourModel");
const AppError = require("../utils/appError");

const bookingSchema = mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
  },
  paymentId: {
    type: String,
    unique: true,
    required: function () {
      return this.status === "confirmed";
    },
  },
  bookingAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

bookingSchema.pre("save", async function (next) {
  const tour = await Tour.findById(this.tour);
  if (!tour) {
    return next(new AppError("Tour not found", 400));
  }

  if (this.numberOfGuests > tour.maxGroupSize) {
    return next(
      new AppError(`Can not book more than ${tour.maxGroupSize} members`)
    );
  }

  if (!this.totalPrice) {
    this.totalPrice = this.numberOfGuests * tour.price;
    console.log("Total price of your booking is ", this.totalPrice);
  }

  next();
});

bookingSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "tour",
    select: "name",
  }).populate({
    path: "user",
    select: "name -_id",
  });

  next();
});

bookingSchema.statics.getTotalRevenue = async function () {
  const stats = await this.aggregate([
    {
      $match: {
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$totalPrice" },
      },
    },
  ]);

  if (stats.length === 0) return 0;

  return stats[0].totalPrice;
};

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
