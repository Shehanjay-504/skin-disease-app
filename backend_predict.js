// ============================================
// Member 2 — Backend Files
// Files: predictController.js, routes/predict.js
// ============================================

// ---- FILE: controllers/predictController.js ----
// Paste this into backend/controllers/predictController.js

const db = require('../config/db');

// -------------------------------------------------------
// TODO: Replace this mock with actual Python ML API call
// When Member 3 finishes the Flask server, replace like this:
//
// const axios = require('axios');
// const predictDisease = async (imagePath) => {
//   const response = await axios.post('http://localhost:5000/predict', {
//     image_path: imagePath
//   });
//   return response.data; // { disease, confidence }
// };
// Then run: npm install axios
// -------------------------------------------------------

const MOCK_DISEASES = [
  { disease: 'Eczema', confidence: 0.91 },
  { disease: 'Psoriasis', confidence: 0.85 },
  { disease: 'Melanoma', confidence: 0.78 },
  { disease: 'Acne Vulgaris', confidence: 0.93 },
  { disease: 'Rosacea', confidence: 0.88 },
  { disease: 'Tinea Corporis', confidence: 0.76 },
  { disease: 'Contact Dermatitis', confidence: 0.82 },
  { disease: 'Basal Cell Carcinoma', confidence: 0.89 },
];

// Mock prediction function — replace with real API call later
const predictDisease = async (imagePath) => {
  return MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];
};

// POST /predict
const predict = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.file.path;
  const userId = req.user.id;

  try {
    // TODO: Replace mock below with real Python ML API call
    const { disease, confidence } = await predictDisease(imagePath);

    // Save prediction to database
    await db.query(
      'INSERT INTO predictions (user_id, image_path, predicted_disease, confidence) VALUES (?, ?, ?, ?)',
      [userId, imagePath, disease, confidence]
    );

    res.json({
      message: 'Prediction successful.',
      result: {
        disease,
        confidence: (confidence * 100).toFixed(1) + '%',
        imagePath
      }
    });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Prediction failed. Please try again.' });
  }
};

module.exports = { predict };


// ============================================
// ---- FILE: routes/predict.js ----
// Paste this into backend/routes/predict.js
// ============================================

/*
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');
const { predict } = require('../controllers/predictController');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images allowed.'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /predict — authenticated users only
router.post('/', verifyToken, allowRoles('user', 'admin'), upload.single('image'), predict);

module.exports = router;
*/
