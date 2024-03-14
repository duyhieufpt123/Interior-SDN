const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  dateImport: {
    type: Date,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true, 
  },
  productMaterial: {
    type: String,
    required: true, 
  },
  productSize: {
    type: String,
    required: true, 
  },
  productQuantity:{
    type: Number,
    required: true
  },
  productDescription: {
    type: String,
    required: true, 
  },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
