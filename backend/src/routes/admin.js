// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getDashboardStats);
router.post('/books', adminController.addBook);

module.exports = router;