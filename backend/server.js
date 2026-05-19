const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const chatRouter = require('./routes/chat');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend statically
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predict', require('./routes/predict'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chat', chatRouter);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Skin Disease API is running.' });
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
