const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password, email, fname, lname } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    // Insert user into the database
    db.query(
      'INSERT INTO users (username, password, email, fname, lname) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, fname, lname],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username or email already exists.' });
          }
          return res.status(500).json({ message: 'Database error.', error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully.' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error registering user.', error: err.message });
  }
});

// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Fetch user from the database
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = results[0];

    try {
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
      res.status(500).json({ message: 'Error logging in.', error: err.message });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
