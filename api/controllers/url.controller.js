const validator = require('validator');
const Url = require('../models/Url.model');
const jwt = require('jsonwebtoken');
const generateShortUrl = require('../utils/generateShortUrl.js');
const QRCode = require('qrcode');
const secret = process.env.JWT_SECRET;

const getUserData = async (req, res) => {
  console.log('Request received at /userData');
  const token = req.cookies.token;

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', decoded);
    const userId = decoded.userId;
    const urls = await Url.find({ userId: userId });
    res.json(urls);
  } catch (err) {
    console.error('Error fetching user URLs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const shortenUrl = async (req, res) => {
  const { originalUrl, userId } = req.body;
  // Validate URL
  if (!validator.isURL(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  const shortenedUrl = generateShortUrl(originalUrl);
  const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day in milliseconds

  try {
    await Url.create({
      originalUrl,
      shortenedUrl,
      userId,
      expiresAt: oneDayFromNow, // Set expiration
    });
    res.json({ shortUrl: `http://localhost:3000/api/url/${shortenedUrl}` });
  } catch (err) {
    console.error('Error shortening URL:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUrlDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.status(200).json(url);
  } catch (error) {
    console.error('Error fetching URL details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const genQR = async (req, res) => {
  const { shortenedUrl } = req.params;

  try {
    const urlData = await Url.findOne({ shortenedUrl });

    if (!urlData) {
      return res.status(404).json({ error: 'Shortened URL not found' });
    }

    const qrCode = await QRCode.toDataURL(
      `http://localhost:3000/api/url/${urlData.shortenedUrl}`
    );

    res.status(200).json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUrl = await Url.findByIdAndDelete(id);
    if (!deletedUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const redirectToOriginal = async (req, res) => {
  const { shortenedUrl } = req.params;
  console.log(shortenedUrl);
  try {
    const url = await Url.findOne({ shortenedUrl });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    const now = new Date();
    if (now > url.expiresAt) {
      return res.status(410).json({ error: 'URL has expired' });
    }

    url.visits++;
    url.lastVisit = now;
    url.visitHistory.push(now);
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error('Error updating URL visits or fetching original URL:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  getUserData,
  shortenUrl,
  getUrlDetails,
  genQR,
  deleteUrl,
  redirectToOriginal,
};
