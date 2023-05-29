const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const PCategory = require("../models/pCategoryModel");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await PCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await PCategory.findByIdAndUpdate(id, req.body, { new: true });

    if (!category) throw new Error("This category is not found!")
    res.status(200).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await PCategory.findByIdAndDelete(id);

    if (!category) throw new Error("This category is not found!");

    res.status(204).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await PCategory.findById(id);

    if (!category) throw new Error("This category is not found!");

    res.status(200).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await PCategory.find();

    res.status(200).json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories };