const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');



const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internshipDB');

// Ensure 'uploads' folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadPath));
app.use(express.static(path.join(__dirname, 'public')));


// Session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));

// Flash middleware
app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/applications', require('./backend/routes/applicationRoutes'));
app.use('/api/offer', require('./backend/routes/offerRoutes'));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

