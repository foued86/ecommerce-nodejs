const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories } = require("../controllers/pCategoryController");

router.post("/new", authMiddleware, isAdmin, createCategory);
router.get("/all", getAllCategories);
router.get("/:id", getCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;