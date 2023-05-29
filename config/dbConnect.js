const mongoose = require("mongoose");

const dbConnect = () => {
    
    try {
        const cnx = mongoose.connect(process.env.MONGO_URL);
        console.log("Connected successfully to DB!");
    } catch (error) {
        console.error("Cant connect to DB!");
    }
}

module.exports = dbConnect;