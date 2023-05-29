const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        //type: mongoose.Schema.Types.ObjectId,
        //ref: "Category",
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
        //enum: ['Apple', 'Samsung', 'Lenovo']
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true,
        //enum: ['Black', 'Brown', 'Red'],
    },
    ratings: [{
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    totalRating : {
        type: String,
        default: 0,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);