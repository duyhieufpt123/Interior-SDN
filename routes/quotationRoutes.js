const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');


router.post('/', auth, roleCheck('admin'), quotationController.createQuotation);

router.get('/all', auth, quotationController.getQuotations);

module.exports = router;
