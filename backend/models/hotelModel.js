const mongoose = require("mongoose");

// hotel schema
const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Hotel must have name"],
  },
  address: {
    type: String,
    required: [true, "Hotel must have address"],
  },
  city: {
    type: String,
    required: [true, "Hotel must have city"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: [true, "Hotel must have coordinates"],
    },
  },
});

hotelSchema.index({ location: "2dsphere" });

// create model outof schema
const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
