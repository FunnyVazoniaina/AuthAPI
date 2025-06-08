const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const connectDB = () => {
 
  mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('Hell YEAH! You re connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
}
module.exports = connectDB;
