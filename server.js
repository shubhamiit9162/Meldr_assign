const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const app = express();
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const pharmacyRoutes = require('./routes/pharmacy');
const medicineRoutes = require('./routes/medicine');
const authMiddleware = require('./middleware/authMiddleware');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Redis client setup
const redisClient = redis.createClient({
  host: 'localhost',  // Redis server host
  port: 6379          // Redis server port
});

redisClient.on('connect', () => {
  console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use(limiter);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pharmacy', {}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => console.log(err));

// Use Redis client in middleware
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/pharmacies', authMiddleware, pharmacyRoutes);
app.use('/api/medicines', authMiddleware, medicineRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Ensure Redis client is properly closed when the process exits
process.on('exit', () => {
  redisClient.quit();
});
