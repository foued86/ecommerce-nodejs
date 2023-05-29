const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const sendEmail = require('./emailController');

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
        // Create new user
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } else {
        throw Error("User already exist!");
    }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(user?._id);
        const updateUser = await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.status(200).
        json({
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            mobile: user?.mobile,
            token: generateToken(user?._id) 
        });
    } else {
        throw new Error("Invalid credentials!");
    }
});

// update a user
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

        if (!user) {
            throw new Error("User is not found!");
        }

        res.status(200).json(user);
    } catch (error) {
        throw new Error(error);
    }
});

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        throw new Error(error);
    }
});

// Get a single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            throw new Error("User is not found!");
        }

        res.status(200).json(user);
    } catch(error) {
        throw new Error(error);
    }
});

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        res.status(200).json(user);
    } catch(error) {
        throw new Error(error);
    }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

        if (!user) {
            throw new Error("User not found!");
        }

        res.json({
            message: "User blocked."
        });
    } catch(error) {
        throw new Error(error);
    }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        if (!user) {
            throw new Error("User not found!");
        }

        res.json({
            message: "User unblocked."
        });
    } catch(error) {
        throw new Error(error);
    }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No user with this refresh token in DB");  
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error(`There is something wrong with refresh token: ${err}`)
        }
        const accessToken = generateToken(user.id);
        res.json({ accessToken });
    })
});

// Logout user
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        })

        return res.sendStatus(204);
    }

    await User.findOneAndUpdate({ refreshToken }, {
        "refreshToken" : "",
    });
    res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
    })

    return res.sendStatus(204);
});

// Update password
const updatePassword = asyncHandler(async (req, res) => {
    const newPassword = req.body.password;
    const { id } = req.user;
    const user = await User.findById(id);
    
    if (!user) {
        throw new Error("User is not found!");
    }

    if (newPassword) {
        user.password = newPassword;
        const userUpdated = await user.save();
        res.status(200).json(userUpdated);
    } else {
        res.json(user);
    }
});

// forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error("User is not found with this email!");

    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, please click at this link to reset you password. 
        This link is valid for 10 minutes from now. <a href='http://${req.headers.host}/api/user/reset-password/${token}'>reset my password</a>`
        const data = {
            to: email,
            text: "Hey user,",
            subject: "Password reset",
            html: resetUrl,
        }
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});


// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if(!user) throw new Error("Token is expired, try later!");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

module.exports = { 
    createUser, 
    loginUser, 
    getAllUsers,
    getUser, 
    deleteUser, 
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPassword,
    resetPassword
};