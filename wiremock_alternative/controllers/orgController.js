const orgRepository = require("../repositories/orgRepository");

exports.addOrg = async (req, res) => {
  try {
    const org = await orgRepository.create(req.body);
    res.status(201).json(org);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllOrgs = async (req, res) => {
  try {
    const orgs = await orgRepository.getAllOrgs();
    res.status(200).json(orgs);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getOrgById = async (req, res) => {
  try {
    const org = await orgRepository.findById(req.params.id);
    if (org) {
      res.status(200).json(org);
    } else {
      res.status(404).send("Org not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateOrgById = async (req, res) => {
  try {
    const org = await orgRepository.updateOrgById(req.params.id, req.body);
    if (org) {
      res.status(200).json(org);
    } else {
      res.status(404).send("Org not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteOrgById = async (req, res) => {
  try {
    const org = await orgRepository.findByIdAndDelete(req.params.id);
    if (org) {
      res.status(200).json(org);
    } else {
      res.status(404).send("Org not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.getOrgByName = async (req, res) => {
  try {
    if(!req.params.name) {
      throw new Error("Org name is required")
    }
    const org = await orgRepository.getOrgByName(req.params.name);
    if (org) {
      res.status(200).json(org);
    } else {
      res.status(404).send("Org not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
