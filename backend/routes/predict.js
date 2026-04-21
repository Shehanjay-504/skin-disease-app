const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { predict } = require('../controllers/predictController');

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
router.post('/', upload.single('image'), predict);

module.exports = router;

