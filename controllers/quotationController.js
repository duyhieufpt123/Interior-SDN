const Quotation = require('../models/quotation');

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
  

module.exports = {
  createQuotation,
  getQuotations,
};
