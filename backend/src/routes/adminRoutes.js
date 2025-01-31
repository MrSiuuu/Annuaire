const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/create-first-admin', adminController.createFirstAdmin);

module.exports = router; 