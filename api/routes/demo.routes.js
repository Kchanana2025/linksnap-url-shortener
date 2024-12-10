/**
 * @swagger
 * tags:
 *   - name: URL Shortening Demo
 *     description: Endpoints for users to try url shortening without loggin in
 */

const express = require('express');

const { redirectToOriginal, genQr, shortenDemo } = require('../controllers/demo.controller.js');

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
router.post('/shorten', shortenDemo);

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
router.get('/:shortenedUrl', redirectToOriginal);

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
router.get('/qr/:shortenedUrl', genQr);

module.exports = router;
