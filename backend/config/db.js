// backend/config/db.js
const mysql = require('mysql2');
require('dotenv').config();  // To access .env variables

// Set up the MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // e.g., your-rds-endpoint.amazonaws.com
  user: process.env.DB_USER,      // e.g., your-db-username
  password: process.env.DB_PASSWORD,  // e.g., your-db-password
  database: process.env.DB_NAME,  // e.g., social_media
  port: 3306,                     // Default MySQL port
});

// Establish connection to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;  // Export the connection for use in other files
