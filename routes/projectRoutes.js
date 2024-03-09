const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const projectController = require('../controllers/projectController')

router.post('/',auth, roleCheck('staff'), projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

module.exports = router;
