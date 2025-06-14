const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hasApplied: { type: Boolean, default: false },
  domain: { type: String },
  applicationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);

