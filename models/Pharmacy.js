const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount: Number,
  image: String
});

const PharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  medicines: [MedicineSchema]
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);
