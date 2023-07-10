const bcrypt = require('bcryptjs');
// const { User } = require('../models/userModel');
const User = require('../models/userModel');
const userRepository = require("../repositories/userRepository");

const saltRounds = 10;

const addUser = async (req, res) => {
  try {
    const { name, username, password, org } = req.body;
    if(!name || !username || !password || !org) {
      return res.status(500).send({ error: 'Invalid name, username, password or organisation' });
    }

    const existingUser = await User.findOne({ username, org });
    if (existingUser) {
      return res.status(409).send({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // const user = new User({
    //   name,
    //   username,
    //   password: hashedPassword,
    //   org: org,
    // });

    // await user.save();

    const usr = await userRepository.create({
      name,
      username,
      password: hashedPassword,
      org: org,
    })
    res.status(201).send({ message: 'User created successfully', usr });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // const user = await User.findOne({ _id: id });
    const user = await userRepository.findById(id)
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

    const user = await userRepository.findById(userId);
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
    const { id } = req.params;

    const user = await User.findOne({ _id: id});
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // await user.remove();
    await userRepository.findByIdAndDelete(id)
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
