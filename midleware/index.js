const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const checkToken = (req, res, next) => {
    if (req.url === '/api/login' || req.url === '/api/createUsers') {
        next()
        return
    } else {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "Authentication failed",
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        try {
            const secretKey =
                process.env.ACCESS_TOKEN_KEY
            if (token) {
                jwt.verify(token, secretKey, async (err, data) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Authentication failed",
                        });
                    }
                    const user = await User.findById(data.payload._id);
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }
                    req.user = user;
                    next();
                });
            } else {
                return res.status(401).json({
                    message: "Authentication failed",
                });
            }
        } catch (error) {
            res.status(401).json({
                message: "Authentication failed",
            });
        }
    }
}

module.exports = checkToken