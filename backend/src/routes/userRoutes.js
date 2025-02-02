const express = require('express');
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.patch('/update', verifyToken, userController.updateUser);
router.patch('/update-password', verifyToken, userController.updatePassword);


router.get('/profile', verifyToken, userController.getUserProfile);

module.exports = router;