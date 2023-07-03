const http = require("http");
const url = require("url");
const querystring = require("querystring");
const { createProxyServer } = require('http-proxy');

// Create an empty map to store mock API servers
const mockApiServers = new Map();

function createMockApiServer() {
    const server = http.createServer((req, res) => {
      const method = req.method.toUpperCase();
      const urlObj = url.parse(req.url);
      const path = urlObj.pathname;
  
      // Look up the route handler function for the requested URL
      const handler = mockApiServers.get(path);
  
      if (handler) {
        // Call the route handler function with the request and response objects
        handler(req, res);
      } else {
        // Return a 404 error for any unknown routes
        res.statusCode = 404;
        res.end(`Cannot ${method} ${path}`);
      }
    });
  
    // Start the server listening on a random port
    server.listen(() => {
      const port = server.address().port;
      console.log(`Mock API server listening on port ${port}`);
    });
  
    // Return the server instance
    return server;
  }

  


// Load the full build.
const _ = require("lodash");
// Import the Route model in app.js
const Route = require("../models/routeModel");
let defaultResponse = {
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: '{"message": "Hello, World!"}',
};

let routeHandlers = [];



module.exports = {
  setDefaultResponse: function (response) {
    defaultResponse = response;
  },
  registerRoute: async function (
    method,
    path,
    response,
    queryParams = null,
    responseTemplate = null
  ) {
    routeHandlers.push(routeData);
  },
  start: async function (port) {
    server.listen(port, () => {
      console.log(`Mock server started on port ${port}`);
    });
    server.on("error", (err) => {
      console.log(err);
    });
  },
  stop: function () {
    server.close(() => {
      console.log("Mock server stopped");
    });
  },
//   getRoutes: async function () {
//     return await Route.find({});
//   },
//   getRouteById: async (routeId) => {
//     return await Route.findOne({ _id: routeId });
//   },
//   updateRouteById: async (req, res) => {
//     try {
//       const { routeId } = req.params;
//       console.log(routeId);
//       const { method, path, responseTemplate, queryParams, response } =
//         req.body;

//       const route = await Route.findOne({ _id: routeId });
//       if (!route) {
//         return res.status(404).send({ error: "Route not found" });
//       }

//       route.method = method || route.method;
//       route.path = path || route.path;
//       route.queryParams = queryParams || route.queryParams;
//       route.responseTemplate = responseTemplate || route.responseTemplate;
//       route.response = response || route.response;

//       await route.save();
//       res.status(200).send(route);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ error: "Internal server error" });
//     }
//   },
//   deleteRouteById: async (req, res) => {
//     try {
//       const { routeId } = req.params;
//       const result = await Route.deleteOne({ _id: routeId });
//       if (result.deletedCount === 0) {
//         return res.status(404).send({ error: "Route not found" });
//       }
//       routeHandlers = routeHandlers.filter((el) => el._id != routeId);
//       return res.status(200).send({ message: "Route deleted successfully" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send({ error: "Internal server error" });
//     }
//   },
};
