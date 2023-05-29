const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById({ _id: id });

        if (!product) {
            res.status(404).send("Product not found!");
        }

        res.status(200).json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Filtering
        let queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el] );
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);        
        let query = Product.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // Limiting fileds
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exist!")
        }

        const products = await query;
        res.status(200).json(products);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            res.json(404).send("Product not found!");
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            res.status(404).send("Product not found!");
        }
        
        res.status(200).json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;

    try {
        let user = await User.findById(_id);
        const alreadyAdded = user.wishList.find((id) => id.toString() === productId);
        if (alreadyAdded) {
            user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishList: productId }
                },
                {
                    new: true
                }
            );
        } else {
            user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishList: productId }
                },
                {
                    new: true
                }
            );
        }
        res.status(200).json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId, comment } = req.body;

    try {
        const product = await Product.findById(productId);
        let alreadyRated = product.ratings.find(
            (item) => item.postedBy.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: _id,
                        },
                    },
                },
                {
                    new: true
                }
            );
        }
        const totalRating = product.ratings.length;
        const ratingSum = product.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr);
        const ratingAvg = Math.round(ratingSum/totalRating);
        const ratedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                totalRating: ratingAvg
            },
            {
                new: true
            }
        );
        res.status(200).json(ratedProduct);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { 
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct, 
    deleteProduct,
    addToWishList,
    rating
};