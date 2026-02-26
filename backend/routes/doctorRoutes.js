const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// @route   GET /api/doctors
// @desc    Get a list of all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching doctors' });
    }
});

// @route   POST /api/doctors
// @desc    Add a new doctor
router.post('/', async (req, res) => {
    try {
        const newDoctor = await Doctor.create(req.body);
        res.status(201).json(newDoctor);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Failed to add doctor. Check your data.' });
    }
});

module.exports = router;
