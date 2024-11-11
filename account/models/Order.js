const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{ name: String, quantity: Number, price: Number }],
  total: Number,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
