const express = require('express');
const redis = require('redis');
const Pharmacy = require('../models/Pharmacy');
const router = express.Router();

// Initialize Redis client
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Middleware to cache pharmacies
const cachePharmacies = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get('pharmacies');
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    req.redisClient = redisClient;
    next();
  } catch (err) {
    console.error('Error accessing Redis:', err);
    next();
  }
};

// Add a pharmacy
router.post('/add', (req, res) => {
  const newPharmacy = new Pharmacy(req.body);
  newPharmacy.save()
    .then(pharmacy => res.json(pharmacy))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get all pharmacies with caching
router.get('/', cachePharmacies, (req, res) => {
  Pharmacy.find()
    .then(pharmacies => {
      req.redisClient.set('pharmacies', 3600, JSON.stringify(pharmacies)); // Cache for 1 hour (3600 seconds)
      res.json(pharmacies);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a pharmacy by ID
router.get('/:id', (req, res) => {
  Pharmacy.findById(req.params.id)
    .then(pharmacy => res.json(pharmacy))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a pharmacy
router.put('/update/:id', (req, res) => {
  Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(pharmacy => res.json(pharmacy))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Search pharmacies by name with caching
router.get('/search', cachePharmacies, (req, res) => {
  const name = req.query.name;
  Pharmacy.find({ name: { $regex: name, $options: 'i' } })
    .then(pharmacies => {
      req.redisClient.set('pharmacies', 3600, JSON.stringify(pharmacies)); // Cache for 1 hour (3600 seconds)
      res.json(pharmacies);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a pharmacy
router.delete('/delete/:id', (req, res) => {
  Pharmacy.findByIdAndDelete(req.params.id)
    .then(() => res.json('Pharmacy deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

// Ensure Redis client is properly closed when the process exits
process.on('exit', () => {
  redisClient.quit();
});
