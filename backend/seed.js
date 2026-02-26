const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const mockDoctors = [
    { name: "Dr. Sarah Jenkins", specialty: "Cardiologist", experience: "15 Years", rating: "4.9/5" },
    { name: "Dr. Michael Chen", specialty: "Neurologist", experience: "12 Years", rating: "4.8/5" },
    { name: "Dr. Emily Rodriguez", specialty: "General Surgeon", experience: "8 Years", rating: "4.9/5" }
];

const seedDoctors = async () => {
    try {
        await connectDB();
        const count = await Doctor.countDocuments();
        if (count === 0) {
            console.log("Seeding doctors...");
            await Doctor.insertMany(mockDoctors);
            console.log("Doctors seeded successfully.");
        } else {
            console.log("Doctors already exist in DB.");
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDoctors();
