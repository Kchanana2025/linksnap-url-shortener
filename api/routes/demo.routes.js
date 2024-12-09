/**
 * @swagger
 * tags:
 *   - name: URL Shortening Demo
 *     description: Endpoints for users to try url shortening without loggin in
 */

require('dotenv').config();
const express = require('express');
const DemoUrl = require('../models/DemoUrl.model');
const QRCode = require('qrcode');
const generateShortUrl = require('../utils/generateShortUrl.js');

const router = express.Router();

/**
 * @swagger
 * /api/demo/shorten:
 *   post:
 *     tags:
 *       - URL Shortening Demo
 *     summary: Shortens a URL
 *     description: Takes a long URL and returns a shortened version with a link that expires in 24 hours.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShortenRequest'
 *     responses:
 *       200:
 *         description: URL successfully shortened. Returns the shortened URL as a response.
 *         $ref: '#/components/responses/ShortenResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/shorten', async (req, res) => {
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
});

/**
 * @swagger
 * /api/demo/{shortenedUrl}:
 *   get:
 *     tags:
 *       - URL Shortening Demo
 *     summary: Redirects to the original URL based on the shortened URL
 *     description: Finds the original URL for a given shortened URL, checks for expiration, and redirects.
 *     parameters:
 *       - $ref: '#/components/parameters/ShortenedUrl'
 *     responses:
 *       200:
 *         description: Successfully redirected to the original URL.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       410:
 *         $ref: '#/components/responses/Expired'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:shortenedUrl', async (req, res) => {
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
});

/**
 * @swagger
 * /api/demo/qr/{shortenedUrl}:
 *   get:
 *     tags:
 *       - URL Shortening Demo
 *     summary: Generates a QR code for the shortened URL
 *     description: Generates a QR code for the given shortened URL that redirects to the original URL.
 *     parameters:
 *       - $ref: '#/components/parameters/ShortenedUrl'
 *     responses:
 *       200:
 *         description: Successfully generated a QR code for the shortened URL. The QR code is returned as a Base64 string.
 *         $ref: '#/components/responses/QrCodeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/qr/:shortenedUrl', async (req, res) => {
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
});

module.exports = router;
