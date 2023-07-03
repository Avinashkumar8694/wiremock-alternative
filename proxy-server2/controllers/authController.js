const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Org = require('../models/orgModel');
require('dotenv').config();

const generateAccessToken = (username, organization) => {
  return jwt.sign({ username, organization }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const authenticateUser = async (username, password) => {
  const user = await User.findOne({ username: username });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  } else {
    return null;
  }
};

const login = async (req, res) => {
  try {
    const { username, password, org } = req.body;
    const user = await authenticateUser(username, password);

    if (user) {
      const accessToken = generateAccessToken(user.username, org);
      res.json({ message: 'Login successful', data: { accessToken } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', data: { user } });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

module.exports = {
  login,
  register
};
