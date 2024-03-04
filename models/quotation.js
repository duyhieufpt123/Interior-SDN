const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotationName: {
    type: String,
    required: true,
    unique: true,
  },
  quotationDescription: {
    type: String,
    required: false,
  },
  quotationCategory: {
    type: String,
    required: true,
  },
  quotationPrice: {
    type: Number,
    required: true,
  },
  quotationManagedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Customer', 'Staff'],
    required: true,
  }
}, {
  timestamps: true
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
