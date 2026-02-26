const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// @route   POST /api/appointments
// @desc    Book a new appointment
router.post('/', async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        // Basic validation
        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: 'Please provide doctorId, date, and time.' });
        }

        // Create a new appointment in the database
        const newAppointment = await Appointment.create({
            doctorId,
            date,
            time
        });

        // Return a success response
        res.status(201).json({
            message: 'Appointment booked successfully!',
            appointment: newAppointment
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Failed to book appointment. Please try again.' });
    }
});

// @route   GET /api/appointments
// @desc    Get all appointments (Optional, but good for testing)
router.get('/', async (req, res) => {
    try {
        // .populate('doctorId') will automatically fetch the doctor's details instead of just showing the ID
        const appointments = await Appointment.find().populate('doctorId');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching appointments' });
    }
});

module.exports = router;
