const express = require('express');
const orgController = require('../controllers/orgController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, orgController.createOrg);
router.get('/:orgId', authenticateToken, orgController.getOrgById);
router.delete('/:orgId', authenticateToken, orgController.deleteOrgById);

module.exports = router;
