const mongoose = require('mongoose');


// URL History Schema with expiration logic
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortenedUrl: String,
  userId: mongoose.Types.ObjectId,
  visits: { type: Number, default: 0 },
  visitHistory: [{ type: Date }],
  lastVisit: { type: Date },
  expiresAt: { type: Date, required: true }, // New field for expiration
});

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const Url = mongoose.model('Url', urlSchema);


module.exports = Url;