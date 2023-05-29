const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands } = require("../controllers/brandController");

router.post("/new", authMiddleware, isAdmin, createBrand);
router.get("/all", getAllBrands);
router.get("/:id", getBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;