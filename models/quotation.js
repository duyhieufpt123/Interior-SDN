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
    enum: ['admin', 'customer', 'staff'],
    required: true,
    default: 'staff'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
}, {
  timestamps: true
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
