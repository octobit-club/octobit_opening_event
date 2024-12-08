const express = require("express");
const mongoose = require("mongoose"); // Import mongoose
const Challenge = require("../models/Challenge"); // Import the Challenge model
require('dotenv').config()

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Stop the script if the connection fails
  }
};

// Create Challenges
const createChallenges = async () => {
  const challenges = [
    { name: "Octo", correctFlag: "flag{octo}" },
    { name: "No Exit Found", correctFlag: "flag{no_exit_found}" },
    { name: "ASCII Master", correctFlag: "flag{ascii_master}" },
    { name: "Good Detective", correctFlag: "flag{good_detective}" },
    { name: "Lucky Patcher", correctFlag: "flag{lucky_patcher}" },
    { name: "Answer to Life", correctFlag: "flag{42}" },
    { name: "We Are Trapped", correctFlag: "flag{we_are_traped}" },
    { name: "You Found Me", correctFlag: "flag{you_found_me}" },
  ];

  try {
    // Insert challenges into the database
    await Challenge.insertMany(challenges);
    console.log("Challenges created successfully!");
  } catch (error) {
    console.error("Error creating challenges:", error);
  }
};

// Run the script
const run = async () => {
  await connectDB(); // Connect to the database
  await createChallenges(); // Create challenges
  mongoose.connection.close(); // Close the connection
};

run();
