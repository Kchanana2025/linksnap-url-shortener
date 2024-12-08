function generateShortUrl() {
  return Math.random().toString(36).substring(2, 7);
}

module.exports = generateShortUrl;
