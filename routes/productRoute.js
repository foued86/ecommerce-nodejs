const express = require("express");
const router = express.Router();
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating } = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/new", authMiddleware, isAdmin, createProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;