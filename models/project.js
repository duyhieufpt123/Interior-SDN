const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
    trim: true,
  },
  projectDescription: {
    type: String,
    required: true
  },
  projectImages: [{
    type: String,
    required: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending','in progress', 'cancelled', 'completed'],
  },
  client: {
    type: String,
    ref: 'Account',
    required: true
  },
  quotation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
    required: true
  }]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
