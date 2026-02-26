const mongoose = require('mongoose');

// This file handles connecting our Node app to MongoDB using Mongoose.

// Replace the URL with your actual MongoDB URI if you are using Atlas (Cloud)
// For local MongoDB, it's typically: mongodb://127.0.0.1:27017/hospitalDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospitalDB';

const connectDB = async () => {
    try {
        // Attempt to establish a connection to the database
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);

        // Exit process with failure code if connection fails
        process.exit(1);
    }
};

module.exports = connectDB;
