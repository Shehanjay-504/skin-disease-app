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

