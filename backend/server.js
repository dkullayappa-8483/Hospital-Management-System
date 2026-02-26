const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Load environment variables (optional for now, can be configured later)
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle JSON payloads and enable Cross-Origin Resource Sharing
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
connectDB();

// Basic welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Hospital Management System API!');
});

// Use routes
// Any request starting with /api/patients goes to our patientRoutes logic
app.use('/api/patients', patientRoutes);

// Any request starting with /api/doctors goes to our doctorRoutes logic
app.use('/api/doctors', doctorRoutes);

// Any request starting with /api/appointments goes to our appointmentRoutes logic
app.use('/api/appointments', appointmentRoutes);

// Start the server and listen on the given port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
