// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');  // Importing the MySQL connection

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON request bodies

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

