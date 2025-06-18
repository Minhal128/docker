const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MongoClient, ObjectId } = require('mongodb');
const RAW_MONGO_URL = 'mongodb://admin:admin123@localhost:27017';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Signup request body:', req.body); // Log the incoming request
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error', error: error.message });
    }
    res.status(500).json({ message: 'Internal server error. Please check backend logs for details.' });
  }
});

// Login route (native driver for direct-inserted users)
router.post('/login', async (req, res) => {
  const client = new MongoClient(RAW_MONGO_URL);
  try {
    const { email, password } = req.body;
    await client.connect();
    const db = client.db('LSD-Database');
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Compare plain text password (since direct-inserted users are not hashed)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  } finally {
    await client.close();
  }
});

// Get user profile (native driver)
router.get('/profile', async (req, res) => {
  const client = new MongoClient(RAW_MONGO_URL);
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    await client.connect();
    const db = client.db('LSD-Database');
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token or error fetching profile', error: error.message });
  } finally {
    await client.close();
  }
});

// Get all users (unified: app + mongo-express, no password)
router.get('/users', async (req, res) => {
  const client = new MongoClient(RAW_MONGO_URL);
  try {
    await client.connect();
    const db = client.db('LSD-Database');
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  } finally {
    await client.close();
  }
});

// TEMP: Insert a test user for debugging
router.get('/debug/insert-test-user', async (req, res) => {
  try {
    const testUser = new User({
      username: 'apitest',
      email: 'apitest@example.com',
      password: 'testpass123',
      isActive: true
    });
    await testUser.save();
    res.json({ message: 'Test user inserted' });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting test user', error: error.message });
  }
});

// Add user directly to MongoDB (native driver, for mongo-express visibility)
router.post('/direct-add-user', async (req, res) => {
  const client = new MongoClient(RAW_MONGO_URL);
  try {
    const { username, email, password, isActive = true } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
    }
    await client.connect();
    const db = client.db('LSD-Database');
    const result = await db.collection('users').insertOne({ username, email, password, isActive });
    res.status(201).json({ message: 'User added directly', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user directly', error: error.message });
  } finally {
    await client.close();
  }
});

module.exports = router; 