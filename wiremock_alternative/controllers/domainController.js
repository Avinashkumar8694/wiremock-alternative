const domainRepository = require("../repositories/domainRepository");

exports.addDomain = async (req, res) => {
  try {
    const domain = await domainRepository.create(req.body);
    res.status(201).json(domain);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllDomain = async (req, res) => {
  try {
    const domains = await domainRepository.getAllDomain();
    res.status(200).json(domains);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getDomainById = async (req, res) => {
  try {
    const domain = await domainRepository.findById(req.params.id);
    if (domain) {
      res.status(200).json(domain);
    } else {
      res.status(404).send("Org not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateDomainById = async (req, res) => {
  try {
    const domain = await domainRepository.updateDomainById(req.params.id, req.body);
    if (domain) {
      res.status(200).json(domain);
    } else {
      res.status(404).send("Domain not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteDomainById = async (req, res) => {
  try {
    const domain = await domainRepository.findByIdAndDelete(req.params.id);
    if (domain) {
      res.status(200).json(domain);
    } else {
      res.status(404).send("Domain not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.getDomainByName = async (req, res) => {
  try {
    if(!req.params.name) {
      throw new Error("Domain name is required")
    }
    const domain = await domainRepository.getDomainByName(req.params.name);
    if (domain) {
      res.status(200).json(domain);
    } else {
      res.status(404).send("Domain not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
