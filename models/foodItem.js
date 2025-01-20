// models/foodItem.js

const mongoose = require('mongoose');

// Define the food item schema
const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    storageLocation: {
        type: String,
        required: true,
        trim: true,
    },
    scheduledForDonation: {
        type: Boolean,
        default: false,
    },
    donationCompleted: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
});

// Method to calculate days until expiry
foodItemSchema.methods.daysUntilExpiry = function () {
    const currentDate = new Date();
    const expiryDate = new Date(this.expiryDate);
    const timeDifference = expiryDate - currentDate;
    const daysUntilExpiry = Math.floor(timeDifference / (1000 * 3600 * 24));  // Converted ms to days
    return daysUntilExpiry;
  };

// Create and export the model
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;

// Travel
// food
// 

