/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 */
require('dotenv').config();
const express = require('express');

const { registerUser, loginUser, checkAuthentication, logoutUser } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Registers a user by creating a new account with a hashed password. Returns a JWT token on successful registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "registered!"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Authenticates a user using username and password. Returns a JWT token on successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "logged in!"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/isAuthenticated:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Check if user is authenticated
 *     description: Verifies the user's authentication status using the JWT token stored in cookies.
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: string
 *                   example: "64efabcd1234567890abcdef"
 *                 name:
 *                   type: string
 *                   example: "john_doe"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/isAuthenticated', checkAuthentication);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout the user
 *     description: Clears the authentication token from cookies, logging the user out.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 */
router.post('/logout', logoutUser);

module.exports = router;
