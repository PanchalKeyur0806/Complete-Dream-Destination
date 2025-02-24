const moment = require("moment-timezone");
const Contact = require("../models/contactModel");
// const Tour = require("../models/tourModel");
const SearchHelper = require("../utils/searchHelper");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// give contact list at ist time
const contactIstTime = (review) => {
  return {
    ...review.toObject(),
    createdAtIst: moment(review.createdAt)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss"),
  };
};

// get all contacts that are in database
exports.getAllContacts = catchAsync(async (req, res, next) => {
  const searchQuery = new SearchHelper(Contact.find(), req.query).searchByField(
    "name"
  );
  const contacts = await searchQuery.query;

  const formatedContacts = contacts.map(contactIstTime);

  res.status(200).json({
    stauts: "success",
    data: formatedContacts,
  });
});

// create contacts in databse
exports.createContacts = catchAsync(async (req, res, next) => {
  const { subject, message } = req.body;

  const newContact = await Contact.create({
    name: req.user.name,
    email: req.user.email,
    subject,
    message,
  });

  if (!newContact) {
    return next(
      new AppError("Contact is not created yet, please try again later", 400)
    );
  }

  res.status(201).json({
    stauts: "success",
    message: "Contact sent successfully",
    data: newContact,
  });
});

// delte specific contact by id
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError("Contact does not exits", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
