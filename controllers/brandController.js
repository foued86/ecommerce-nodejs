const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true });

    if (!brand) throw new Error("This brand is not found!")
    res.status(200).json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) throw new Error("This brand is not found!");

    res.status(204).json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);

    if (!brand) throw new Error("This brand is not found!");

    res.status(200).json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const categories = await Brand.find();

    res.status(200).json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands };