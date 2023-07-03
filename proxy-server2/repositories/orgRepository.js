const Org = require('../models/orgModel');

exports.create = async (orgData) => {
  const org = new Org(orgData);
  return await org.save();
};

exports.findById = async (orgId) => {
  return await Org.findById(orgId).exec();
};

exports.findByIdAndDelete = async (orgId) => {
  return await Org.findByIdAndDelete(orgId).exec();
};
