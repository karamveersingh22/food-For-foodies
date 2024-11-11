// database.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// // Function to drop the database
// const cleanDatabase = async () => {
//   try {
//     await mongoose.connection.db.dropDatabase();
//     console.log('Database dropped successfully');
//   } catch (error) {
//     console.error('Error dropping database:', error.message);
//   }
// };

// // Usage
// const cleanDB = async () => {
//   await connectDB();
//   await cleanDatabase();
//   process.exit();
// };

// cleanDB();

module.exports = connectDB;