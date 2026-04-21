const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');
const { getAllUsers, getAllPredictions, getStats, deleteUser } = require('../controllers/adminController');

// ALL routes below require: valid JWT + admin role
router.use(verifyToken, allowRoles('admin'));

router.get('/users', getAllUsers);
router.get('/predictions', getAllPredictions);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);

module.exports = router;