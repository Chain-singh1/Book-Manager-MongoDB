const mongoose = require('mongoose');

function DbConnection() {
    const DB_URL = process.env.MONGO_URI;
    mongoose.connect(DB_URL);
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));

db.once("open", function(){
    console.log("Database connected")
});

module.exports = DbConnection;


// const mongoose = require("mongoose");

// async function DbConnection() {
//     try {
//         const DB_URL = process.env.MONGO_URI;

//         await mongoose.connect(DB_URL);

//         console.log("Database connected successfully");
//     } catch (error) {
//         console.error("MongoDB connection error:", error.message);
//         process.exit(1);
//     }
// }


// module.exports = DbConnection;
