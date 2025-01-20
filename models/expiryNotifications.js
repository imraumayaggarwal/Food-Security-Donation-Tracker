const cron = require('node-cron');
const nodemailer = require('nodemailer');
const FoodItem = require('./foodItem');
const User = require('./User');

// Function to send expiry notifications
const sendExpiryNotifications = async () => {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const foodItems = await FoodItem.find({
        $and: [
            { expiryDate: { $lte: sevenDaysLater } }, // Food items expiring in 7 days or less
            { expiryDate: { $gte: today } } // Not expired yet
        ]
    });

    foodItems.forEach(async (foodItem) => {
        const user = await User.findById(foodItem.user);
        if (user) {
            sendEmail(user.email, foodItem); // Sending email to user
        }
    });
};

// Function to send email
const sendEmail = (userEmail, foodItem) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'foodtracker211@gmail.com',
            pass: 'cxuadlwfermyerma'  
        }
    });

    const mailOptions = {
        from: 'foodtracker211@gmail.com',
        to: userEmail,
        subject: `Food Expiry Reminder: ${foodItem.name}`,
        text: `Your food item ${foodItem.name} is about to expire on ${foodItem.expiryDate}. Please take necessary action.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

//setting time to send notifications
//9 AM, 3 PM, and 9 PM
cron.schedule('0 9 * * *', () => {
    console.log('Checking food expiry at 9 AM...');
    sendExpiryNotifications();
});

cron.schedule('0 15 * * *', () => {
    console.log('Checking food expiry at 3 PM...');
    sendExpiryNotifications();
});

cron.schedule('0 21 * * *', () => {
    console.log('Checking food expiry at 9 PM...');
    sendExpiryNotifications();
});

// Export function
module.exports = sendExpiryNotifications;
