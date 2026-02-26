const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// @route   GET /api/patients
// @desc    Get a list of all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find(); // Find all patient documents
        res.json(patients); // Send the data back to the client as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching patients' });
    }
});

// @route   POST /api/patients
// @desc    Register a new patient
router.post('/', async (req, res) => {
    try {
        // Create a new patient inside our database using the info from the request body
        const newPatient = await Patient.create(req.body);

        // Send back a success status code (201) and the newly created patient
        res.status(201).json(newPatient);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Failed to add patient. Check your data.' });
    }
});

module.exports = router;
