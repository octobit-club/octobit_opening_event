const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const challengeRouter = require("./routes/challengeroutes");
const teamRouter = require("./routes/teamroutes");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.URI;

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", challengeRouter);
app.use("/api", teamRouter);
app.use(
  cors({
    origin: "https://event-octobit.fun/:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
    // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
// MongoDB Connection
mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connected successfully");

    // Start the server only after the database is connected
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
    process.exit(1); // Exit the process if the database connection fails
  });
