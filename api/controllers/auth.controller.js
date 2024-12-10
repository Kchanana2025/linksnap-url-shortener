const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
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
};

const loginUser = async (req, res) => {
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
};

const checkAuthentication = async (req, res) => {
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
};

const logoutUser = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
  }

module.exports = { registerUser, loginUser, checkAuthentication, logoutUser };
