// GET TOUR MODAL
const Tour = require("../models/tourModel");
// IMAGES_UPLOAD
const upload = require("../utils/uploadImages");
// ERROR HADNLING
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// GET ALL TOURS
exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  if (!tours) return next(new AppError("Tours not found", 404));

  res.status(200).json({
    status: "Success",
    tours,
  });
});

// GET TOUR
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate(
    "review hotel guides"
  );

  if (!tour) return next(new AppError("Tour not found", 404));

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

// CREATE TOUR

// upload image
exports.uploadImages = upload.single("imageCover");
// create Tour
exports.createTour = catchAsync(async (req, res, next) => {
  const {
    name,
    duration,
    maxGroupSize,
    location,
    price,
    priceDiscount,
    description,
    startDate,
    endDate,
    guides,
  } = req.body;

  const locationData = req.body.location ? JSON.parse(location) : null;
  if (!locationData) {
    return next(new AppError("Location is not defiend", 400));
  }

  // handle image
  const imageCover = req.file ? req.file.path : null;
  const guideIds = guides ? guides.split(",") : [];

  const newTour = await Tour.create({
    name,
    duration: Number(duration),
    maxGroupSize: Number(maxGroupSize),
    location: {
      coordinates: locationData.coordinates,
    },
    price: Number(price),
    priceDiscount: Number(priceDiscount),
    description,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    imageCover,
    guides: guideIds,
  });

  if (!newTour) return next(new AppError("Tour is not created", 404));

  res.status(200).json({
    status: "success",
    newTour,
  });
  // res.json({message: "Create Tour"})
});

// UPDATE TOUR
exports.updateTour = catchAsync(async (req, res, next) => {
  // const {location} = req.body
  const imageCover = req.file ? req.file.path : undefined;
  const guideIds = req.body.guides ? req.body.guides.split(",") : undefined;

  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      guides: guideIds,
      imageCover: imageCover || req.body.imageCover,
    },
    { new: true }
  );

  if (!updatedTour) return next(new AppError("Tour not found", 404));

  res.status(200).json({
    status: "Success",
    updatedTour,
  });
});

// DELETE TOUR
exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  if (!deletedTour) return next(new AppError("Tour not found", 404));

  res.status(200).json({
    status: "success",
    deletedTour,
  });
});
