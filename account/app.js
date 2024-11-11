// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const connectDB = require('./database');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItems');
const Order = require('./models/Order');

dotenv.config();
connectDB();

const app = express()




// MongoDB connection
// mongodb://localhost:27017/authDB

// mongoose.connect('mongodb+srv://Karamveersinghsuri:karam12345@cluster0.pu2dm.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

    
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
  });
//   mongoose.connect('mongodb://localhost:27017/authDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     serverSelectionTimeoutMS: 30000, // 30 seconds
//     socketTimeoutMS: 45000 // 45 seconds
//   });

  

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// app.js
app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error', 'User already registered. Please login.');
      return res.redirect('/login');
    }
  
    // Create and save the new user with role
    const user = new User({ email, password, role });
    await user.save();
    req.flash('success', 'Registration successful. You can now log in.');
    res.redirect('/login');
  });
  

  app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
  
    // Find user with specified role
    const user = await User.findOne({ email, role });
    if (!user) {
      req.flash('error', 'No account found with this role. Please check your role or register.');
      return res.redirect('/login');
    }
  
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials. Please try again.');
      return res.redirect('/login');
    }
  
    // Redirect based on role
    if (user.role === 'admin') {
      req.flash('success', 'Logged in as Admin.');
      res.redirect('/admin');
    } else {
      req.flash('success', 'Logged in successfully!');
      res.redirect('/dashboard');
    }
  });
  
  
  app.get('/dashboard', async (req, res) => {
    try {
      const menu = await MenuItem.find({ available: true }); // Fetch only available items
      res.render('dashboard', { menu });
    } catch (error) {
      console.error('Error fetching menu items:', error);
      req.flash('error', 'Error fetching menu items.');
      res.redirect('/login');
    }
  });
  
  
  
  app.post('/order', async (req, res) => {
    const items = req.body.items || {}; // Selected items with their prices
    const quantities = req.body.quantities || {}; // Quantities with a default empty object if not provided
  
    let orderItems = [];
    let total = 0;
  
    // Calculate total for each item and accumulate total bill
    for (let itemName in items) {
      const price = parseFloat(items[itemName]);
      const quantity = quantities[itemName] ? parseInt(quantities[itemName], 10) : 1;
      const itemTotal = price * quantity;
      total += itemTotal;
  
      // Store item details for rendering
      orderItems.push({ name: itemName, price, quantity, itemTotal });
    }
  
    // Render the order summary
    res.render('order', { orderItems, total });
  });
  
  
  
  
  
  
  app.post('/confirm-order', (req, res) => {
    res.render('confirm-order');
  });
  
//   ***********************************************************admin side 

// Display Admin Panel
// Display Admin Panel
app.get('/admin', async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' });
    const completedOrders = await Order.find({ status: 'completed' });
    
    // Calculate total sales for completed orders
    const totalSales = completedOrders.reduce((total, order) => total + order.total, 0);
    
    res.render('admin', { pendingOrders, completedOrders, totalSales });
  } catch (error) {
    console.error('Error fetching orders:', error);
    req.flash('error', 'Error fetching orders.');
    res.redirect('/login');
  }
});

// Mark Order as Completed
app.post('/admin/complete-order/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    await Order.findByIdAndUpdate(orderId, { status: 'completed' });
    req.flash('success', 'Order marked as completed.');
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating order status:', error);
    req.flash('error', 'Error updating order status.');
    res.redirect('/admin');
  }
});


// Server start
app.listen(3000, () => console.log('Server started on http://localhost:3000'));
