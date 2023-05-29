const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const pCategoryRouter = require("./routes/pCategoryRoute");
const bCategoryRouter = require("./routes/bCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// Config
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("tiny"));
// VAR Declaration
const PORT = process.env.PORT || 3000;

// DB connection
dbConnect();

// Routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/product/category', pCategoryRouter);
app.use('/api/blog/category', bCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);

// middlewares
app.use(notFound);
app.use(errorHandler);

// Listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})