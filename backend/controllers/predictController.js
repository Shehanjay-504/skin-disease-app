const db = require('../config/db');
const axios = require('axios');

/**
 * 1. REAL ML SERVER CALL (Flask server ekata katha karana hati)
 * Oyaage Member 3 Flask server eka run karanawa nam meka pavichchi karanna.
 */
const getRealPrediction = async (imagePath) => {
    try {
        const response = await axios.post('http://localhost:5000/predict', {
            image_path: imagePath
        });
        return response.data; // Result: { disease, confidence }
    } catch (error) {
        console.error("ML Server Error:", error);
        throw error; // Meka error ekak unoth catch block ekata yanawa
    }
};

/**
 * 2. MOCK DATA (Server eka nathuwa test karanna)
 */
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

// ==========================================
// MAIN CONTROLLER FUNCTION
// ==========================================
const predict = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded.' });
    }

    const imagePath = req.file.path;
    const userId = req.user ? req.user.id : 1; // User auth nathnam default 1 gannawa

    try {
        /**
         * CHANGE HERE: 
         * Real ML server ekata katha karanna oni nam 'getRealPrediction(imagePath)' danna.
         * Danata test karanna 'getMockPrediction()' pavichchi karamu.
         */
        const { disease, confidence } = await getMockPrediction();

        // Save prediction to database
        const sql = 'INSERT INTO predictions (user_id, image_path, predicted_disease, confidence) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [userId, imagePath, disease, confidence], (err, result) => {
            if (err) {
                console.error('Database INSERT error:', err);
                // DB error unath user-ta result eka pennamu
            }

            res.json({
                message: 'Prediction successful.',
                result: {
                    disease,
                    confidence: (confidence * 100).toFixed(1) + '%',
                    imagePath: imagePath.replace(/\\/g, '/') // Windows path fix
                }
            });
        });

    } catch (err) {
        console.error('Prediction error:', err);
        res.status(500).json({ error: 'Server error. Make sure backend is running.' });
    }
};

module.exports = { predict };

