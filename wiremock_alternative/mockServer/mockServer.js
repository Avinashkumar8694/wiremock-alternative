const http = require("http");
const url = require("url");
const querystring = require("querystring");
const handlebars = require('handlebars');
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

const server = http.createServer((request, response) => {
  let requestBody = "";
  request.on("data", (chunk) => {
    requestBody += chunk;
  });
  request.on("end", () => {
    const parsedUrl = url.parse(request.url);
    const queryParams = querystring.parse(parsedUrl.query);

    let matchingHandler = routeHandlers.find((handler) => {
      let methodMatch = handler.method === request.method;
      let urlMatch = parsedUrl.pathname === handler.path;
      let queryParamsMatch = true;
      if (handler.queryParams) {
        for (let [key, value] of Object.entries(handler.queryParams)) {
          if (queryParams[key] !== value) {
            queryParamsMatch = false;
            break;
          }
        }
      }
      return methodMatch && urlMatch && queryParamsMatch;
    });

    if (!matchingHandler) {
      matchingHandler = { response: defaultResponse };
    }

    let responseBody = matchingHandler.response.body;
    let body = {};
    if (matchingHandler.responseTemplate) {
      // Compile the responseBody ------ working perfectly, uncomment the following line if you need
      // for (let [key, value] of Object.entries(queryParams)) {
      //   let pattern = new RegExp(`{{${key}}}`, "g");
      //   responseBody = responseBody.replace(pattern, value);
      // }


      const compiledTemplate = handlebars.compile(matchingHandler.responseTemplate);
        body = compiledTemplate({
          query: queryParams,
          body: responseBody,
        });
    } else {
      body = responseBody;
    }

    response.writeHead(
      matchingHandler.response.statusCode,
      matchingHandler.response.headers
    );
    const contentType = matchingHandler.response.headers["Content-Type"];
    if (contentType === "application/json") {
      try {
        requestBody = JSON.parse(body);
        response.end(JSON.stringify(requestBody));
      } catch (error) {
        response.statusCode = 400;
        response.end(`Invalid JSON: ${error.message}`);
        return;
      }
    } else {
      response.end(body);
    }
  });
});

module.exports = {
  setDefaultResponse: function (response) {
    defaultResponse = response;
  },
  registerRoute: async function (
    method,
    path,
    response,
    queryParams = null,
    responseTemplate = null,
    subDomain
  ) {
    const route = new Route({
      method: method,
      path: path,
      queryParams: queryParams,
      response: response,
      responseTemplate: responseTemplate,
      subDomain: subDomain
    });

    const exist = await Route.findOne({ method: method, path: path });
    if (exist) {
      throw new Error(`Route Exists`);
    }
    const routeData = await route.save();
    routeHandlers.push(routeData);
  },
  start: async function (port) {
    // Load routes from MongoDB and update routeHandlers
    const routes = await Route.find({});
    routes.forEach((route) => {
      routeHandlers.push(route);
    });
    server.listen(port, () => {
      console.log(`Mock server started on port ${port}`);
    });
    server.on('error', (err) => {
      console.log(err)
    });
  },
  stop: function () {
    server.close(() => {
      console.log("Mock server stopped");
    });
  },
  getRoutes: async function () {
    return await Route.find({});
  },
  getRouteById: async (routeId) => {
    return await Route.findOne({ _id: routeId });
  },
  updateRouteById: async (req, res) => {
    try {
      const { routeId } = req.params;
      console.log(routeId);
      const { method, path, responseTemplate, queryParams, response } =
        req.body;

      const route = await Route.findOne({ _id: routeId });
      if (!route) {
        return res.status(404).send({ error: "Route not found" });
      }

      route.method = method || route.method;
      route.path = path || route.path;
      route.queryParams = queryParams || route.queryParams;
      route.responseTemplate = responseTemplate || route.responseTemplate;
      route.response = response || route.response;
      const index = routeHandlers.findIndex(el=>el.path == path);
      routeHandlers[index] = route;
      console.log(routeHandlers);
      await route.save();
      res.status(200).send(route);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
  deleteRouteById: async (req, res) => {
    try {
      const { routeId } = req.params;
      const result = await Route.deleteOne({ _id: routeId });
      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "Route not found" });
      }
      routeHandlers = routeHandlers.filter(el=>el._id != routeId)
      return res.status(200).send({ message: "Route deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  },
};
