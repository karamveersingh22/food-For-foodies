require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem'); // Ensure the path is correct
const connectDB = require('./database');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

connectDB()

const menuItems = [
  { name: "CHICKEN CURRY", category: "CHICKEN MAIN COURSE", price: 70, available: true },
  { name: "CHICKEN HOME STYLE CURRY", category: "CHICKEN MAIN COURSE", price: 80, available: true },
  { name: "CHICKEN KASA", category: "CHICKEN MAIN COURSE", price: 80, available: true },
  { name: "CHICKEN BUTTER MASALA", category: "CHICKEN MAIN COURSE", price: 90, available: true },
  // Add all other menu items here similarly...
  { name: "PANNEER PAKODA", category: "PANNEER PAKODA", price: 80, available: true }
];

async function seedMenu() {
  try {
    await MenuItem.deleteMany({}); // Clear existing data
    await MenuItem.insertMany(menuItems); // Insert new data
    console.log('Menu items seeded successfully');
  } catch (error) {
    console.error('Error seeding menu items:', error);
  } finally {
    //mongoose.connection.close(); // Close the connection
  }
}

seedMenu();
