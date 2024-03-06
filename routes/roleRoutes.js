const express = require('express');
const { auth } = require('../middleware/auth');
const roleController = require('../controllers/roleController');

const router = new express.Router();

router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRoles);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id',roleController.deleteRole);

module.exports = router;
