const mongoose = require('mongoose');

const aveminutSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  soil_moisture: { type: Number, required: true },
  height: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Aveminuts', aveminutSchema);