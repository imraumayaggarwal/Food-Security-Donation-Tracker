const mongoose = require('mongoose');

const DonationScheduleSchema = new mongoose.Schema({
    foodItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodItem',
            required: true,
        },
    ],
    donationDate: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DonationSchedule', DonationScheduleSchema);
