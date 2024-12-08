const mongoose = require('mongoose');



// Demo URL Schema with expiration logic
const demoUrlSchema = new mongoose.Schema({
  demo_originalUrl: String,
  demo_shortUrl: String,
  expiresAt: { type: Date, required: true }, // New field for expiration
});

demoUrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const DemoUrl = mongoose.model('DemoUrl', demoUrlSchema);

module.exports = DemoUrl;