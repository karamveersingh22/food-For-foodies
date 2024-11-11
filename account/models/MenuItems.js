const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
