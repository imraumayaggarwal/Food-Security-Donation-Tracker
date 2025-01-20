# Food Expiry and Donation Tracker

## Project Overview
The **Food Expiry and Donation Tracker** is a web application designed to help individuals and organizations manage their food inventory, track expiry dates, and coordinate donations to reduce food waste and support food security efforts. The platform helps users ensure timely use or donation of food, providing a seamless way to track inventory and connect with local charities.

## Features

### 1. **Food Inventory Management**
   - Users can log and track food items in their inventory, including expiration dates, quantities, and storage locations.
   - A visual dashboard displays food items and their status to help users stay organized.

### 2. **Expiry Date Notifications**
   - Automated notifications alert users when food items are nearing their expiration dates.
   - Notifications are sent via email to users to remind them to consume or donate expiring food.

### 3. **Donation Scheduling**
   - Users can select food items that are close to expiration and schedule donations to local charities or food banks.
   - Donation details, such as the charity's contact information and required items, are displayed.

### 4. **Charity Directory**
   - A list of local charities and food banks is available, along with contact details and donation requirements.
   - Users can directly reach out to charities to coordinate food donations.

### 5. **Food Tracking**
   - Keep track of the amount of food donated over time and monitor efforts to reduce food waste.

### 6. **User Dashboard**
   - A personalized dashboard for each user to view their inventory, upcoming expiry dates, and donation history.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Service**: Nodemailer (for sending expiry reminders)
- **Cron Jobs**: node-cron (for scheduling expiry reminder emails)
- **Authentication**: JWT (JSON Web Token) for secure user login

## Installation

### Prerequisites
- Node.js
- MongoDB

### Steps to Run the Project Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/imraumayaggarwal/Food-Security-and-Donation-Tracker.git
    cd food-expiry-donation-tracker
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory and add the following:
      ```env
      PORT=3000
      MONGO_URI=mongodb://localhost:27017/food-tracker
      JWT_SECRET=your_jwt_secret
      EMAIL_USER=your_email@gmail.com
      EMAIL_PASS=your_email_password
      ```

4. Start the server:
    ```bash
    npm start
    ```

5. Open the application in your browser:
    - Navigate to `http://localhost:3000`.

## Routes

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: User login to generate JWT.

### Food Items
- **GET** `/api/food`: Get all food items.
- **POST** `/api/food`: Add a new food item.
- **PUT** `/api/food/:id`: Update a food item.
- **DELETE** `/api/food/:id`: Delete a food item.

### Donation Scheduling
- **POST** `/api/donations`: Schedule a food donation.

## Cron Jobs

The application uses cron jobs to check for expiring food items and send email reminders at the following times:
- 9:00 AM
- 3:00 PM
- 9:00 PM

These jobs are scheduled using the `node-cron` library.

## Email Notifications

The application sends expiry reminder emails using **Nodemailer**. You'll need to configure your email service credentials in the `.env` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
## THANK YOU!