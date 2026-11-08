const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import the User model
const User = require("./models/User");

// Load environment variables from config/.env
dotenv.config({ path: "./config/.env" });

// Initialize Express
const app = express();

// Allow Express to read JSON data from requests
app.use(express.json());

// Get the port from the environment variables
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// 1. GET: Retrieve all users

app.get("/users", async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();

    // Return the users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. POST: Add a new user

app.post("/users", async (req, res) => {
  try {
    // Get the user information from the request body
    const { name, email, age } = req.body;

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      age,
    });

    // Return the created user
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. PUT: Update a user by ID

app.put("/users/:id", async (req, res) => {
  try {
    // Get the ID from the URL
    const { id } = req.params;

    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if the user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 4. DELETE: Remove a user by ID
// ==========================================

app.delete("/users/:id", async (req, res) => {
  try {
    // Get the ID from the URL
    const { id } = req.params;

    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if the user exists
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return a confirmation message
    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
