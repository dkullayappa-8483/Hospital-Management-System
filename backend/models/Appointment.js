const mongoose = require('mongoose');

// Define the Appointment schema
const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // References the Doctor model
        required: true
    },
    date: {
        type: String, // Can also be type Date, but String is easy for frontend date pickers (YYYY-MM-DD)
        required: true
    },
    time: {
        type: String, // E.g., '10:30 AM'
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Appointment model
module.exports = mongoose.model('Appointment', appointmentSchema);
