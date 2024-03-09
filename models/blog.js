const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    blogsTitle: {
    type: String,
    required: true,
    trim: true
  },
  blogsContent: {
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

const Blogs = mongoose.model('Blogs', blogsSchema);

module.exports = Blogs;
