const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const upload = require('../middleware/uploadMiddleware');

// Add a new medicine to a pharmacy
router.post('/add/:pharmacyId', upload, (req, res) => {
  Pharmacy.findById(req.params.pharmacyId)
    .then(pharmacy => {
      if (!pharmacy) {
        return res.status(404).json('Pharmacy not found');
      }
      const newMedicine = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        image: req.file ? req.file.path : null
      };
      pharmacy.medicines.push(newMedicine);
      pharmacy.save()
        .then(() => res.json(pharmacy))
        .catch(err => res.status(400).json('Error saving pharmacy: ' + err));
    })
    .catch(err => res.status(400).json('Error finding pharmacy: ' + err));
});

// Get all medicines of a pharmacy
router.get('/:pharmacyId', (req, res) => {
  Pharmacy.findById(req.params.pharmacyId)
    .then(pharmacy => {
      if (!pharmacy) {
        return res.status(404).json('Pharmacy not found');
      }
      res.json(pharmacy.medicines);
    })
    .catch(err => res.status(400).json('Error finding pharmacy: ' + err));
});

// Update a medicine
router.put('/update/:pharmacyId/:medicineId', upload, (req, res) => {
  Pharmacy.findById(req.params.pharmacyId)
    .then(pharmacy => {
      if (!pharmacy) {
        return res.status(404).json('Pharmacy not found');
      }
      const medicine = pharmacy.medicines.id(req.params.medicineId);
      if (medicine) {
        medicine.name = req.body.name || medicine.name;
        medicine.description = req.body.description || medicine.description;
        medicine.price = req.body.price || medicine.price;
        medicine.discount = req.body.discount || medicine.discount;
        if (req.file) {
          medicine.image = req.file.path;
        }
        pharmacy.save()
          .then(() => res.json(medicine))
          .catch(err => res.status(400).json('Error saving pharmacy: ' + err));
      } else {
        res.status(404).json('Medicine not found');
      }
    })
    .catch(err => res.status(400).json('Error finding pharmacy: ' + err));
});

// Delete a medicine
router.delete('/delete/:pharmacyId/:medicineId', (req, res) => {
  Pharmacy.findById(req.params.pharmacyId)
    .then(pharmacy => {
      if (!pharmacy) {
        return res.status(404).json('Pharmacy not found');
      }
      const medicine = pharmacy.medicines.id(req.params.medicineId);
      if (medicine) {
        medicine.remove();
        pharmacy.save()
          .then(() => res.json('Medicine deleted.'))
          .catch(err => res.status(400).json('Error saving pharmacy: ' + err));
      } else {
        res.status(404).json('Medicine not found');
      }
    })
    .catch(err => res.status(400).json('Error finding pharmacy: ' + err));
});

module.exports = router;
