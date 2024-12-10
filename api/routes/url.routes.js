require('dotenv').config();

const express = require('express');
const { getUserData, shortenUrl, getUrlDetails, deleteUrl, genQR, redirectToOriginal } = require('../controllers/url.controller.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: URL Shortening
 *     description: Endpoints related to URL shortening for logged in users
 */
/**
 * @swagger
 * /api/url/userData:
 *   get:
 *     tags:
 *       - URL Shortening
 *     summary: Get all shortened URLs for the logged-in user
 *     description: Fetches the URLs shortened by the user based on the JWT token.
 *     responses:
 *       200:
 *         description: Successfully retrieved URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   originalUrl:
 *                     type: string
 *                   shortenedUrl:
 *                     type: string
 *       401:
 *         description: Unauthorized access due to missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/userData', getUserData);

/**
 * @swagger
 * /api/url/shorten:
 *   post:
 *     tags:
 *       - URL Shortening
 *     summary: Shortens a URL
 *     description: Takes a long URL and returns a shortened version with a link.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The original long URL
 *                 example: "http://example.com/long-url"
 *               userId:
 *                 type: string
 *                 description: The user ID of the person shortening the URL
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Shortened URL successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "http://localhost:3000/api/url/abc123"
 *       400:
 *         description: Invalid URL format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid URL format"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/shorten', shortenUrl);

/**
 * @swagger
 * /api/url/details/{id}:
 *   get:
 *     tags:
 *       - URL Shortening
 *     summary: Get details of a shortened URL
 *     description: Fetches the details of a shortened URL based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the shortened URL
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalUrl:
 *                   type: string
 *                 shortenedUrl:
 *                   type: string
 *                 userId:
 *                   type: string
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "URL not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/details/:id', getUrlDetails);

/**
 * @swagger
 * /api/url/qr/{shortenedUrl}:
 *   get:
 *     tags:
 *       - URL Shortening
 *     summary: Generate a QR code for a shortened URL
 *     description: Generates a QR code image for the shortened URL that can be scanned.
 *     parameters:
 *       - in: path
 *         name: shortenedUrl
 *         required: true
 *         description: The shortened URL to generate a QR code for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   description: Base64 encoded QR code
 *       404:
 *         description: Shortened URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Shortened URL not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/qr/:shortenedUrl', genQR);

/**
 * @swagger
 * /api/url/delete/{id}:
 *   delete:
 *     tags:
 *       - URL Shortening
 *     summary: Delete a shortened URL
 *     description: Deletes a shortened URL based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the URL to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL deleted successfully"
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "URL not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/delete/:id', deleteUrl);

/**
 * @swagger
 * /api/url/{shortenedUrl}:
 *   get:
 *     tags:
 *       - URL Shortening
 *     summary: Redirect to the original URL
 *     description: Redirects the user to the original URL associated with the shortened URL.
 *     parameters:
 *       - in: path
 *         name: shortenedUrl
 *         required: true
 *         description: The shortened URL to be redirected
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       404:
 *         description: Shortened URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "URL not found"
 *       410:
 *         description: URL expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "URL has expired"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/:shortenedUrl', redirectToOriginal);

module.exports = router;
