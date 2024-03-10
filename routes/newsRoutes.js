const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck('staff'), newsController.createNews);
router.get('/', newsController.getAllNews);
router.get('/:id',newsController.getNewById);
router.delete('/:id', auth, roleCheck('staff'), newsController.deleteNewById);


module.exports = router;
