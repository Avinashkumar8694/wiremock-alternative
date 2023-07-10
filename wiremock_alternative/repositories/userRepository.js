const User = require('../models/userModel');

exports.create = async (userData) => {
  const usr = new User(userData);
  return await usr.save();
};

exports.findById = async (userId) => {
  return await User.findById(userId).exec();
};

exports.findByIdAndDelete = async (userId) => {
  return await User.findByIdAndDelete(userId).exec();
};
exports.getAllUsers = async function () {
  return await User.find({});
};
exports.getUserByName = async function (userName) {
  return await User.findOne({ name: userName });
};
exports.updateUserById = async function (userId, newData) {
  return await User.findByIdAndUpdate(userId, newData, { new: true });
};