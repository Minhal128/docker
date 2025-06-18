require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/LSD-Database?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Native MongoDB driver for raw user fetch (for debugging)
const RAW_MONGO_URL = 'mongodb://admin:admin123@localhost:27017';

app.get('/api/auth/raw-users', async (req, res) => {
  const client = new MongoClient(RAW_MONGO_URL);
  try {
    await client.connect();
    const db = client.db('LSD-Database');
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raw users', error: error.message });
  } finally {
    await client.close();
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 