// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key'); // Verifying the token
        req.user = decoded;  // Store the decoded token (user info) in the request
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = protect;
