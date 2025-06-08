const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

require("dotenv").config();

//Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies like form submissions
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

// defining route
app.use("/api/users", userRoutes);
