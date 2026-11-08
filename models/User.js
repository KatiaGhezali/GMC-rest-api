const mongoose = require("mongoose");

// Define the structure of a User document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt
    timestamps: true,
  },
);

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the model to used it
module.exports = User;
