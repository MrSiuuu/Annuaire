const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/', reviewController.addReview);
router.get('/:company_id', reviewController.getReviewsByCompany);

router.post('/', verifyToken, reviewController.addReview);
router.get('/:company_id', reviewController.getReviewsByCompany);


module.exports = router;