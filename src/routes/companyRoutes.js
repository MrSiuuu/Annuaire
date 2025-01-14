const express = require('express');

const verifyToken = require('../middlewares/authMiddleware'); // Middleware pour vérifier l'authentification si besoin
const companyController = require('../controllers/companyController');
const upload = require('../config/multer');

const router = express.Router();

router.post('/', companyController.addCompany);
router.post('/login', companyController.loginCompany);
router.get('/', companyController.getAllCompanies);  
router.get('/search', companyController.searchCompanies); 
router.get('/:id', companyController.getCompanyById);
router.put('/:id/verify', verifyToken, companyController.verifyCompany);
router.get('/:id/stats', companyController.getCompanyStats);
router.patch('/update', verifyToken, companyController.updateCompany);
router.patch('/logo', verifyToken, upload.single('logo'), companyController.uploadLogo);




module.exports = router;