const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/create-first-admin', adminController.createFirstAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/pending-companies', adminController.getPendingCompanies);
router.get('/verified-companies', adminController.getVerifiedCompanies);
router.patch('/verify-company/:id', adminController.verifyCompany);

module.exports = router; 