const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');


router.post('/', auth, roleCheck('admin'), quotationController.createQuotation);
router.get('/', quotationController.getQuotations);
router.put('/:id', auth, roleCheck('admin'), quotationController.updateQuotationById);
router.post('/calculate-quotation', auth, quotationController.calculateQuotation);

module.exports = router;
