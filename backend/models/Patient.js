const mongoose = require('mongoose');

// Define a schema: This specifies how a patient document should look in our database
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // 'name' is mandatory
    },
    age: {
        type: Number,
        required: true // 'age' is mandatory
    },
    diagnosis: {
        type: String, // E.g., 'Flu', 'Fracture', etc.
        required: true
    },
    admissionDate: {
        type: Date,
        default: Date.now // Defaults to the current date if not provided specifically
    }
});

// Export the Patient model to use it in other parts of our app (like our routes)
module.exports = mongoose.model('Patient', patientSchema);
