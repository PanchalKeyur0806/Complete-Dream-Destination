// GET TOUR MODAL
const Tour = require("../models/tourModel");
// IMAGES_UPLOAD
const upload = require("../utils/uploadImages");
// ERROR HADNLING
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const SearchHelper = require("../utils/searchHelper");

// GET ALL TOURS
exports.getTours = catchAsync(async (req, res, next) => {
  const { search, date } = req.query
  console.log("Extracted directly:", { search, date });

  const params = { search, date };

  let searchQuery = new SearchHelper(Tour.find(), params)
    .searchByField("name")
    .filterByDate("startDate");
  const tours = await searchQuery.query;

  if (!tours) return next(new AppError("Tours not found", 404));

  res.status(200).json({
    status: "Success",
    length: tours.length,
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
  try {
    // Extract fields from request body
    const {
      name,
      duration,
      maxGroupSize,
      price,
      priceDiscount,
      description,
      startDate,
      endDate,
      location,
      guides,
    } = req.body;

    // Parse location data
    let locationData;
    try {
      locationData = JSON.parse(location);
    } catch (error) {
      return next(new AppError("Invalid location data format", 400));
    }

    if (!locationData || !locationData.coordinates) {
      return next(new AppError("Location coordinates are required", 400));
    }

    const start = new Date(startDate);
    console.log("start date is ,...............", start);
    // calculate end date
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + Number(duration));
    console.log("end date is.................", end);

    // Handle image
    const imageCover = req.file ? req.file.path : null;

    // Create the tour
    const newTour = await Tour.create({
      name,
      duration: Number(duration),
      maxGroupSize: Number(maxGroupSize),
      location: {
        type: "Point",
        coordinates: locationData.coordinates,
      },
      price: Number(price),
      priceDiscount: priceDiscount ? Number(priceDiscount) : undefined,
      description,
      startDate: new Date(startDate),
      endDate: new Date(end),
      imageCover,
      guides, // Initialize empty if not provided
    });

    if (!newTour) {
      return next(new AppError("Failed to create tour", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
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

// get total tours
exports.getTotalTours = catchAsync(async (req, res, next) => {
  const getAllTours = await Tour.totalTours();

  res.status(200).json({
    status: "success",
    getAllTours,
  });
});
