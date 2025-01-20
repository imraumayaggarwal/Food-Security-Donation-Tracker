// routes
const express = require('express');
const FoodItem = require('../models/foodItem');
const protect = require('../middleware/auth');
const router = express.Router();

// Add a new food item (protected)
router.post('/add', protect, async (req, res) => {
    const { name, quantity, expiryDate, storageLocation } = req.body;

    try {
        const newFoodItem = new FoodItem({
            name,
            quantity,
            expiryDate,
            storageLocation,
            user: req.user.id,  //Links food item to the logedinn user
        });
        await newFoodItem.save();
        res.status(201).json({ message: 'Food item added successfully!', newFoodItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all food items (protected)
router.get('/all', protect, async (req, res) => {
    try {
        const foodItems = await FoodItem.find({ user: req.user.id });  // Shows food items for the loggedin user
        res.status(200).json(foodItems);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific food item by ID (public route)
router.get('/:id', async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) return res.status(404).json({ error: 'Food item not found' });
        res.status(200).json(foodItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a food item by ID (protected)
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFoodItem) return res.status(404).json({ error: 'Food item not found' });
        res.status(200).json({ message: 'Food item updated successfully!', updatedFoodItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a food item by ID (protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedFoodItem = await FoodItem.findByIdAndDelete(req.params.id);
        if (!deletedFoodItem) return res.status(404).json({ error: 'Food item not found' });
        res.status(200).json({ message: 'Food item deleted successfully!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all expired food items (protected)
router.get('/expired', protect, async (req, res) => {
    try {
        const expiredFoodItems = await FoodItem.find({
            user: req.user.id,
            expiryDate: { $lt: new Date() }  // Compare expiry date with the current date
        });
        res.status(200).json(expiredFoodItems);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
