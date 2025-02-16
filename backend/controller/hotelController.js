// custom modules
const Hotel = require("../models/hotelModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get all hotel
exports.getAllHotel = catchAsync(async (req, res, next) => {
  const getHotels = await Hotel.find();

  res.status(200).json({
    status: "success",
    data: getHotels,
  });
});

// create hotel
exports.createHotel = catchAsync(async (req, res, next) => {
  const { name, address, city, location } = req.body;

  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return next(
      new AppError(
        "Hotel must have valid coordinates [longitude, latitude]",
        400
      )
    );
  }

  const newHotel = await Hotel.create({
    name,
    address,
    city,
    location: {
      type: "Point",
      coordinates: location.coordinates, // ['longitude, 'latitude']
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      newHotel,
    },
  });
});

//  get hotel
exports.getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new AppError("Hotel doesn't exists", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      hotel,
    },
  });
});