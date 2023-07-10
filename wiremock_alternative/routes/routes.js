const express = require("express");
const router = express.Router();
const {
  addOrg,
  getAllOrgs,
  getOrgById,
  updateOrgById,
  deleteOrgById,
  getOrgByName
} = require("../controllers/orgController");
const {
  addDomain,
  getAllDomain,
  getDomainById,
  updateDomainById,
  deleteDomainById,
  getDomainByName
} = require("../controllers/domainController");
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const { register, login } = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");
const {registerRoute, setDefaultResponse, start, getRoutes, getRouteById, updateRouteById,deleteRouteById} = require("../mockServer/mockServer");


// Org Routes
router.post("/orgs", authenticateToken, addOrg);
router.get("/orgs", authenticateToken, getAllOrgs);
router.get("/orgs/:id", authenticateToken, getOrgById);
router.put("/orgs/:id", authenticateToken, updateOrgById);
router.delete("/orgs/:id", authenticateToken, deleteOrgById);
router.post("/orgs/:name", authenticateToken, getOrgByName);

// Domain Routes
router.post("/domain", authenticateToken, addDomain);
router.get("/domains", authenticateToken, getAllDomain);
router.get("/domains/:id", authenticateToken, getDomainById);
router.put("/domains/:id", authenticateToken, updateDomainById);
router.delete("/domains/:id", authenticateToken, deleteDomainById);
router.post("/domains/:name", authenticateToken, getDomainByName);

// User Routes
router.post("/users",authenticateToken,  addUser);
router.get("/users", authenticateToken, getAllUsers);
router.get("/users/:id", authenticateToken, getUserById);
router.put("/users/:id", authenticateToken, updateUserById);
router.delete("/users/:id", authenticateToken, deleteUserById);

// // Auth Routes
router.post("/register", register);
router.post("/login", login);

// Add Dynamic Routes
// Define the API to register a new route
router.post("/register-route", authenticateToken, async (req, res) => {
  // Parse the request body
  try {
    const { method, path, response, queryParams, responseTemplate, subDoumain } = req.body;
  
    if(!method || !path || !response?.statusCode || !response?.body){
      res.status(400).json({ message: "Invalid Route data"})
    }
  
    // Register the new route with the mock server
    await registerRoute(
      method,
      path,
      response,
      queryParams,
      responseTemplate,
      subDoumain
    );
  
    // Return a success response
    res.status(200).json({ message: "Route registered successfully" });
  } catch (e) {
    res.status(403).json({ message: e.message });

  }
});

router.get("/routes", authenticateToken, async (req, res) => {
  const routeData = await getRoutes();
  res.status(200).json(routeData);
});

router.get("/routes/:routeId",authenticateToken, async (req, res) => {
  try {
    const { routeId } = req.params;
    const route = await getRouteById(routeId);
    if (!route) {
      return res.status(404).send({ error: 'route not found' });
    }
    res.status(200).send(route);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});
router.put("/routes/:routeId", authenticateToken, updateRouteById);
router.delete("/routes/:routeId", authenticateToken, deleteRouteById);


start(9292);
// Set the default response for unmatched requests
setDefaultResponse({
  statusCode: 404,
  headers: {'Content-Type': 'text/plain'},
  body: 'Not Found'
});

module.exports = router;
