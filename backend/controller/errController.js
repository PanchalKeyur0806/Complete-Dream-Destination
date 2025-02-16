const AppError = require("../utils/appError");

// HANDLE CAST ERROR FROM MONGODB
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// HANDLE DUPLICATE ERROR FROM MONGODB
const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate field value entered. Please use another value.`;
  return new AppError(message, 400);
};

// HANDLE VALIDATION ERROR FROM MONGODB
const handleValidationErrorDB = (err) => {
  const errorMessages = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: ${errorMessages.join(". ")}`;
  return new AppError(message, 400);
};

// SEND ERROR TO DEVELOPMENT
const sendDevelopmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// SEND ERROR TO PRODUCTION
const sendProductionError = (err, res) => {
  console.error("Production Error:", err);

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      name: err.name,
      message: err.message || "Something went wrong!",
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong!",
    });
  }
};

// EXPORT AS GLOBAL ERROR HANDLER
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevelopmentError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(new Error(), err);
    error.message = err.message || "Something went wrong!";

    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateErrorDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);

    sendProductionError(error, res);
  }
};
