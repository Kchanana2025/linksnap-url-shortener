/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 */
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secret = process.env.JWT_SECRET;

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
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id, username }, secret, {
      expiresIn: '2d',
    });
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.json({ message: 'registered!' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id, username }, secret, {
      expiresIn: '2d',
    });
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.json({ message: 'logged in!' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
router.get('/isAuthenticated', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const { userId, username } = decoded;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ isAuthenticated: true, userId, name: username });
  } catch (err) {
    return res.json({ isAuthenticated: false });
  }
});

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
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});

module.exports = router;
