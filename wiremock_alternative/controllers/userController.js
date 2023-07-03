const bcrypt = require('bcryptjs');
// const { User } = require('../models/userModel');
const User = require('../models/userModel');

const saltRounds = 10;

const addUser = async (req, res) => {
  try {
    const { name, username, password, org } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      username,
      password: hashedPassword,
      org: org._id,
    });

    await user.save();
    res.status(201).send({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ org: req.org._id });
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId, org: req.org._id });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, username } = req.body;

    const user = await User.findOne({ _id: userId, org: req.org._id });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    user.name = name || user.name;
    user.username = username || user.username;

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, org: req.org._id });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    await user.remove();
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
