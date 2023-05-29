const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const tokenExist = req?.headers?.authorization?.startsWith('Bearer');

    if(tokenExist) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error('Invalid token!');
        }
    } else {
        throw new Error('There is no token in the header!')
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (user.role !== "admin") {
        throw new Error("You are not an admin");
    } else {
        next();
    }

});

module.exports = { authMiddleware, isAdmin };