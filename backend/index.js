// INSTALLED PACKAGES
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

// ROUTES
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// ERROR HANDLING
const globalErrorHandler = require("./controller/errController");
const AppError = require("./utils/appError");

// create an express() app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  "/uploads",
  (req, res, next) => {
    const cacheDuration = 60 * 60 * 24 * 7;

    // Set cache control headers
    res.set("Cache-Control", `public, max-age=${cacheDuration}`);
    res.set(
      "Expires",
      new Date(Date.now() + cacheDuration * 1000).toUTCString()
    );

    // Continue to the next middleware (static file serving)
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// routes middleware
app.use("/api/tours", tourRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} url`, 404))
})

// use this middleware for error handling
app.use(globalErrorHandler);

module.exports = app;
