const db = require('../config/db');
const axios = require('axios');


 
const getRealPrediction = async (imagePath) => {
    try {
        const response = await axios.post('http://localhost:5000/predict', {
            image_path: imagePath
        });
        return response.data; // Result: { disease, confidence }
    } catch (error) {
        console.error("ML Server Error:", error);
        throw error; 
    }
};


 
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

const getMockPrediction = async () => {
    return MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)];
};

// MAIN CONTROLLER FUNCTION

const predict = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded.' });
    }

    const imagePath = req.file.path;
    const userId = req.user.id; // User ID from verified token 

    try {
        // Get mock prediction 
        const { disease, confidence } = await getMockPrediction();

        // Save prediction to database
        const sql = 'INSERT INTO predictions (user_id, image_path, predicted_disease, confidence) VALUES (?, ?, ?, ?)';
        const result = await db.query(sql, [userId, imagePath, disease, confidence]);
        console.log('Prediction saved:', { userId, disease, confidence, imagePath });

        // Send response after saving
        res.json({
            message: 'Prediction successful.',
            result: {
                disease,
                confidence: (confidence * 100).toFixed(1) + '%',
                imagePath: imagePath.replace(/\\/g, '/') 
            }
        });

    } catch (err) {
        console.error('Prediction error:', err);
        res.status(500).json({ error: 'Server error. Make sure backend is running.' });
    }
};

// GET /predict/history — user's own history
const getHistory = async (req, res) => {
  try {
    // Prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const [rows] = await db.query(
      `SELECT id, image_path, predicted_disease, confidence, created_at
       FROM predictions
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    console.log('History query result:', rows);
    res.json({ history: rows });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
};


module.exports = { predict, getHistory };

