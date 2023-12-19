
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://theajaygupta7071:dFrtyfFEucQ32QIK@cluster0.zrj1bmq.mongodb.net/yogaDB?retryWrites=true&w=majority'
);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Define the MongoDB schema and model
const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  selectedBatch: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admission = mongoose.model('Admission', admissionSchema);

// API endpoint to handle form submissions
app.post('/submitForm', async (req, res) => {
  try {
    // Handle form data and database interaction here
    // For example:
    const formData = req.body;
    const admission = new Admission(formData);
    await admission.save();

    // Respond with success
    res.json({ success: true });
  } catch (error) {
    console.error('Error handling form submission:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// All other requests go to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
