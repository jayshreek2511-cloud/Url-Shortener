const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicksCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  clicks: [{
    timestamp: { type: Date, default: Date.now },
    referrer: { type: String, default: 'Direct' },
    browser: { type: String, default: 'Unknown' },
    platform: { type: String, default: 'Unknown' }
  }]
});

module.exports = mongoose.model('Url', urlSchema);
