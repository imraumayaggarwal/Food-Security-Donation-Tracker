const express = require('express');
const DonationSchedule = require('../models/donationSchedule');
const FoodItem = require('../models/foodItem');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/schedule-donation', protect, async (req, res) => {
    const { foodItems, donationDate } = req.body;

    if (!foodItems || !donationDate) {
        return res.status(400).json({ error: 'Food items and donation date are required.' });
    }

    try {
        //Donation schedule
        const schedule = new DonationSchedule({
            foodItems,
            donationDate,
            user: req.user.id,
        });

        // Updates the food items to mark them as scheduled for donation
        await FoodItem.updateMany(
            { _id:{ $in: foodItems } },
            { $set:{ scheduledForDonation: true } }
        );

        await schedule.save();
        res.status(201).json({ message: 'Donation schedule created successfully!', schedule });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all donation schedules for the logged-in user
router.get('/donation-schedules', protect, async (req, res) => {
    try {
        const schedules = await DonationSchedule.find({ user: req.user.id }).populate('foodItems');
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all food items that are scheduled for donation
router.get('/scheduled-food-items', protect, async (req, res) => {
    try {
        const schedules = await DonationSchedule.find({ user: req.user.id }).populate('foodItems');
        const scheduledFoodItems = schedules.flatMap(schedule => schedule.foodItems);
        res.status(200).json(scheduledFoodItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
