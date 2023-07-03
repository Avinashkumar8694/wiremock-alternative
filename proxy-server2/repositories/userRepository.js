const User = require('../models/userModel');

exports.create = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

exports.findById = async (userId) => {
  return await User.findById(userId).exec();
};

exports.findByIdAndDelete = async (userId) => {
  return await User.findByIdAndDelete(userId).exec();
};
