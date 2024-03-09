const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  newsTitle: {
    type: String,
    required: true,
    trim: true
  },
  newsContent: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  author: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
