// Order.js

// models/Order.js

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{ name: String, quantity: Number, price: Number }],
  total: Number,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  date: { type: Date, default: Date.now },
  userName: { type: String, required: true } // Add user's name for each order
});

module.exports = mongoose.model('Order', OrderSchema);
