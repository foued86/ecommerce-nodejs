const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");


const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

    if (!coupon) throw new Error("This coupon is not found!");

    res.status(200).json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) throw new Error("This coupon is not found!");

    res.status(204).json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
};