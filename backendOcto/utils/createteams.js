require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const Team = require("../models/Team"); // Ensure the path is correct

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the script if the connection fails
  }
};

// Add new teams without overwriting existing ones
const addTeams = async () => {
  const newTeams = [
    { name: "Octobit Zeta", password: "Zeta6%t7" },
    { name: "Octobit Eta", password: "Eta4*p9" },
    { name: "Octobit Theta", password: "Theta3&d1" },
    { name: "Octobit Iota", password: "Iota5!r2" },
    { name: "Octobit Kappa", password: "Kappa7^u3" },
  ];

  try {
    for (const team of newTeams) {
      // Check if the team already exists
      const existingTeam = await Team.findOne({ name: team.name });
      if (existingTeam) {
        console.log(`Team "${team.name}" already exists. Skipping.`);
      } else {
        // Add the team if it doesn't exist
        await Team.create(team);
        console.log(`Team "${team.name}" added successfully.`);
      }
    }
  } catch (error) {
    console.error("Error adding teams:", error);
  } finally {
    mongoose.connection.close(); // Close the connection after the operation
  }
};

// Execute the script
const run = async () => {
  await connectDB();
  await addTeams();
};

run();
