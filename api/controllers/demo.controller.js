const DemoUrl = require('../models/DemoUrl.model');
const QRCode = require('qrcode');
const generateShortUrl = require('../utils/generateShortUrl.js');
require('dotenv').config();

const shortenDemo = async (req, res) => {
    const { demo_originalUrl } = req.body;
  
    const demo_shortUrl = generateShortUrl(demo_originalUrl);
    const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day in milliseconds
  
    try {
      await DemoUrl.create({
        demo_originalUrl,
        demo_shortUrl,
        expiresAt: oneDayFromNow, // Set expiration
      });
      res.json({ shortUrl: `http://localhost:3000/api/demo/${demo_shortUrl}` });
    } catch (err) {
      console.error('Error inserting demo URL:', err);
      res.status(500).json({ error: 'Failed to insert URL into database' });
    }
  }


  const redirectToOriginal = async (req, res) => {

    const { shortenedUrl } = req.params;
  
    try {
      const demoUrl = await DemoUrl.findOne({
        demo_shortUrl: shortenedUrl,
      });
      if (!demoUrl) return res.status(404).json({ error: 'URL not found' });
  
      const now = new Date();
      if (now > demoUrl.expiresAt) {
        return res.status(410).json({ error: 'URL has expired' }); // HTTP 410 Gone
      }
  
      res.redirect(demoUrl.demo_originalUrl);
    } catch (err) {
      console.error('Error fetching original URL:', err);
      res.status(500).json({ error: err.message });
    }
  }

  const genQr = async (req, res) => {
    const { shortenedUrl } = req.params;
  
    try {
      // Find the URL data in your database
      const urlData = await DemoUrl.findOne({ demo_shortUrl: shortenedUrl });
  
      if (!urlData) {
        return res.status(404).json({ error: 'Shortened URL not found' });
      }
  
      // Generate a QR code for the original URL
      const qrCode = await QRCode.toDataURL(`http://localhost:3000/api/demo/${urlData.demo_shortUrl}`);
  
      // Send the QR code as a response
      res.status(200).json({ qrCode });
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {shortenDemo, redirectToOriginal, genQr}