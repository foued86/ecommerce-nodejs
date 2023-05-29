const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    numViews:{
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/922745190/fr/photo/blogs-blog-des-id%C3%A9es-de-concepts-avec-table-de-travail.jpg"
    },
    author: {
        type: String,
        default: "Admin",
    },
},
{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);