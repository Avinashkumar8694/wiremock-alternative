const express = require("express");
const router = express.Router();
const {
  addOrg,
  getAllOrgs,
  getOrgById,
  updateOrgById,
  deleteOrgById,
} = require("../controllers/orgController");
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const { register, login } = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");
const {registerRoute, setDefaultResponse, start, getRoutes, getRouteById, updateRouteById,deleteRouteById, createMockApiServer, addMockApiRoute } = require("../mockServer/mockServer");


// Org Routes
router.post("/orgs", authenticateToken, addOrg);
router.get("/orgs", authenticateToken, getAllOrgs);
router.get("/orgs/:orgId", authenticateToken, getOrgById);
router.put("/orgs/:orgId", authenticateToken, updateOrgById);
router.delete("/orgs/:orgId", authenticateToken, deleteOrgById);

// User Routes
router.post("/users",authenticateToken,  addUser);
router.get("/users", authenticateToken, getAllUsers);
router.get("/users/:userId", authenticateToken, getUserById);
router.put("/users/:userId", authenticateToken, updateUserById);
router.delete("/users/:userId", authenticateToken, deleteUserById);

// // Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/create_server", createMockApiServer);
router.post("/route/add", addMockApiRoute);
router.post("/mock/api", addMockApiRoute);

// Add Dynamic Routes
// Define the API to register a new route
router.post("/register-route", authenticateToken, async (req, res) => {
  // Parse the request body
  try {
    const { method, path, response, queryParams, responseTemplate } = req.body;
  
    if(!method || !path || !response?.statusCode || !response?.body){
      res.status(400).json({ message: "Invalid Route data"})
    }
  
    // Register the new route with the mock server
    await registerRoute(
      method,
      path,
      response,
      queryParams,
      responseTemplate
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


// start(9292);
// Set the default response for unmatched requests
setDefaultResponse({
  statusCode: 404,
  headers: {'Content-Type': 'text/plain'},
  body: 'Not Found'
});

module.exports = router;
