const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require("../controllers/couponController");


router.post("/new", authMiddleware, isAdmin, createCoupon);
router.get("/all", getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;