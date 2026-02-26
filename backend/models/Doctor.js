const mongoose = require('mongoose');

// Define the Doctor schema
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    experience: {
        type: String, // E.g., '15 Years'
        required: true
    },
    rating: {
        type: String, // E.g., '4.9/5'
        required: true
    }
});

// Export the Doctor model
module.exports = mongoose.model('Doctor', doctorSchema);
