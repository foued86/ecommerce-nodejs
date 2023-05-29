const express = require("express");
const router = express.Router();
const { 
    createUser,
    loginUser, 
    getAllUsers, 
    getUser, 
    deleteUser, 
    updateUser, 
    handleRefreshToken, 
    logout, 
    updatePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blockUser, unblockUser } = require("../controllers/userController")

router.post("/register", createUser);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/refresh-token", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, getUser);
router.delete("/:id", deleteUser);
router.put("/edit", authMiddleware, updateUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;