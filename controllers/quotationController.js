const Quotation = require('../models/quotation');
const Account = require('../models/Account');
const sendEmail = require('../utils/mailer')

const createQuotation = async (req, res) => {
  try {
    const duplicateQuotation = await Quotation.findOne({ quotationName: req.body.quotationName });
    if (duplicateQuotation) {
      return res.status(409).send({ message: 'A quotation with this name already exists.' });
    }
    const quotation = new Quotation(req.body);
    await quotation.save();
    res.status(201).send(quotation);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getQuotations = async (req, res) => {
    try {
      const quotations = await Quotation.find({}, 'quotationName quotationDescription quotationCategory quotationPrice');
  
      const results = quotations.map(quotation => ({
        quotationId: quotation._id,
        quotationName: quotation.quotationName,
        quotationDescription: quotation.quotationDescription,
        quotationCategory: quotation.quotationCategory,
        quotationPrice: quotation.quotationPrice,
      }));
  
      res.status(200).json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  };

const updateQuotationById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['quotationName', 'quotationDescription', 'quotationCategory', 'quotationPrice', 'quotationManagedBy', 'role', 'status']

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidOperation){
    return res.status(400).send({ error: 'Invalid updates Quotation!'})
  }

  try{
    const quotation = await Quotation.findById(req.params.id);
    if(!quotation){
      return res.status(400).send({ error: 'Quotation not found '})
    }
    updates.forEach((update) => quotation[update] = req.body[update]);
    await quotation.save();
    res.send(quotation);
    console.log(quotation)
  } catch(error){
    res.status(400).send({error: 'Update Quotation failed, please check again!'})
  }
}

const calculateQuotation = async (req, res) => {
  try {
    const { quotationIds, email, phone } = req.body;

    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(404).send({ message: 'Account not found.' });
    }

    const customerName = `${account.firstName} ${account.lastName}`;

    const customerPhone = account.phone;

    const quotations = await Quotation.find({
      '_id': { $in: quotationIds }
    });
    const totalPrice = quotations.reduce((sum, quotation) => sum + quotation.quotationPrice, 0);

    const subject = 'Your Quotation Estimate Prices';
    const text = `Dear ${customerName},\n\nYour estimated price is: ${totalPrice}$.\n\nThank You for using our service.\n\nFaithfully,\nThái MMA Interior`;


    await sendEmail(account._id, subject, text);

    res.status(200).send({
      message: "Quotation calculated and email sent successfully.",
      listQuotation: quotationIds,
      customerName: customerName,
      customerPhone: customerPhone,
      estimateCost: totalPrice
      
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

  

module.exports = {
  createQuotation,
  getQuotations,
  updateQuotationById,
  calculateQuotation
};
