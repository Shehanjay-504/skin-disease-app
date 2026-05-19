const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { predict, getHistory } = require('../controllers/predictController');
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');

// Multer storage config 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /predict
router.post('/', verifyToken, upload.single('image'), predict);

// GET /predict/history
router.get('/history', verifyToken, allowRoles('user', 'admin'), getHistory);

module.exports = router;

