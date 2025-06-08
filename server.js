const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
// Connect to MongoDB
connectDB();
const app = express();
require("dotenv").config();
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
