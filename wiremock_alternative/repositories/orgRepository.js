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
exports.getAllOrgs = async function () {
  return await Org.find({});
};
exports.getOrgByName = async function (orgName) {
  return await Org.findOne({ name: orgName });
};
exports.updateOrgById = async function (orgId, newData) {
  return await Org.findByIdAndUpdate(orgId, newData, { new: true });
};
