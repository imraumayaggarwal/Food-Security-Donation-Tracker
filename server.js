// Importing Express, Mongoose, and Food Routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const expiryNotifications = require('./models/expiryNotifications');

// Initialize the app
const app = express();

// Middleware to parse JSON
app.use(express.json()); // Allows to send and receive JSON data

//Enabling cors
app.use(cors());

// MongodB Atlas connection
mongoose.connect('mongodb+srv://aggarwalraumay:L5SwGsWijbDYNKYt@cluster0.cewrn.mongodb.net/food_security?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

// Authentication routes
app.use('/api/auth', authRoutes);

// Food inventory routes
app.use('/api/food', foodRoutes);  // This connects the food routes

// Donation Scheduling routes
app.use('/api/donation', donationRoutes);

//Expiry notifications
expiryNotifications();

//port for the server to listen on
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
