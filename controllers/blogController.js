const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

const createBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json({
            status: "success",
            newBlog: blog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedBlog) throw new Error("This blog is not found");
        res.status(200).json(updatedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        let blog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        
        if (!blog) throw new Error("This blog is not found");

        // increment th number of views
        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 }
        }, { new : true });

        res.status(200).json(blog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        let blog = await Blog.findByIdAndDelete(id);
        
        if (!blog) throw new Error("This blog is not found");

        res.status(204).json(blog);
    } catch (error) {
        throw new Error(error);
    }
});

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);

    if (!blog) throw new Error("This blog is not found!");

    const loggedUserId = req?.user?._id;
    const isLiked = blog.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
        ((userId) => userId?.toString() === loggedUserId?.toString())
    );

    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loggedUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.status(200).json(blog);
    }

    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loggedUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.status(200).json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loggedUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.status(200).json(blog);
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);

    if (!blog) throw new Error("This blog is not found!");

    const loggedUserId = req?.user?._id;
    const isDisliked = blog.isDisliked;
    const alreadyLiked = blog?.likes?.find(
        ((userId) => userId?.toString() === loggedUserId?.toString())
    );

    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loggedUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.status(200).json(blog);
    }

    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loggedUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.status(200).json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loggedUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.status(200).json(blog);
    }
});

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog
};