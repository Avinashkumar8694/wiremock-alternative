const Domain = require('../models/domains');

exports.create = async (domainData) => {
  const domain = new Domain(domainData);
  return await domain.save();
};

exports.findById = async (domainId) => {
  return await Domain.findById(domainId).exec();
};

exports.findByIdAndDelete = async (domainId) => {
  return await Domain.findByIdAndDelete(domainId).exec();
};
exports.getAllDomain = async function () {
  return await Domain.find({});
};
exports.getDomainByName = async function (domainName) {
  return await Domain.find({ name: domainName });
};
exports.updateDomainById = async function (domainId, newData) {
  return await this.findByIdAndUpdate(domainId, newData, { new: true });
};