const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Contact must have a user name"],
  },
  email: {
    type: String,
    required: [true, "Contact must have a user email"],
  },
  subject: {
    type: String,
    required: [true, "Contact subject must required"],
    min: [4, "subject should have atleast 4 characters"],
    min: [40, "Contact subject should have atleast 40 characters"],
  },
  message: {
    type: String,
    required: [true, "Please provide your message here"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
