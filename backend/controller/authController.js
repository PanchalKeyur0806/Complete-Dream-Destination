// Core modules
const crypto = require("crypto");
// Installed modules
const jwt = require("jsonwebtoken");
// Custom modules
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

// for sign token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create normal user
const createUser = async ({ name, email, password, role = "user" }) => {
  return await User.create({
    name,
    email,
    password,
    role,
  });
};

// create tour guides
// only admin can do this
exports.tourGuide = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await createUser({ name, email, password, role: "tour-guide" });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.me = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new AppError("There is not user found", 400));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// sign up users
// for normal users
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await createUser({ name, email, password });

  if (!user) {
    return next(new AppError("User is not created", 400));
  }

  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: false,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// login code
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter email or password", 401));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect  email or passwords", 401));
  }

  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: false,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "", { httpOnly: false, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

// protect routes
exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError(
        "You are not logged in! please login to access this page",
        401
      )
    );
  }

  // verify toekn
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  if (user.changePasswordAfter(decode.iat)) {
    return next(
      new AppError("User resently changed password! please login again", 401)
    );
  }

  req.user = user;
  next();
});

// for restricting to authorized users
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    next();
  };
};

// forget password function
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User does not exists", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? please click this link to change your password ${resetUrl}. If you didn't make this request please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (Valid for 10 minutes)`,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `There was a error sending emial. please try again ${err}`,
        500
      )
    );
  }
});

// Reset passwords function
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid token or token is expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  user.save();

  const token = signToken(user._id);
  res.cookie("jwt", token, {
    httpOnly: false,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });

  res.status(200).json({
    status: "success",
    token,
  });
});
