const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, userController.createUser);
router.get('/:userId', authenticateToken, userController.getUserById);
router.delete('/:userId', authenticateToken, userController.deleteUserById);

module.exports = router;
