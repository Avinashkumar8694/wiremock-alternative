const http = require("http");
const url = require("url");
const querystring = require("querystring");
const { createProxyServer } = require("http-proxy");

// Load the full build.
const _ = require("lodash");
// Import the Route model in app.js
const { Route, routeSchema } = require("../models/routeModel");
let defaultResponse = {
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: '{"message": "Hello, World!"}',
};

// ----------------------------Start ------------------------------------
const httpProxy = require("http-proxy");
const { validate } = require("schema-utils");
const mockApiServers = new Map();

function createMockApiServer(host) {
  const mockApiServer = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const queryParams = reqUrl.query;
    const path = reqUrl.pathname;

    // Find a matching API route based on the method and path
    const handler = mockApiServers.get(host);
    // const mockApiRoute = mockApiRoutes.find(
    //   (route) => {
    //     return route.method === req.method && route.path === path
    //   }
    // );

    if (handler) {
      handler(req, res);
      // Validate the query parameters (if any)
      // if (mockApiRoute.queryParams) {
      //   validate({ ...queryParams }, routeSchema.properties.queryParams);
      // }

      // // Set the response headers
      // for (const [header, value] of Object.entries(mockApiRoute.response.headers)) {
      //   res.setHeader(header, value);
      // }

      // // Set the response status code
      // res.statusCode = mockApiRoute.response.statusCode;

      // Set the response body (either from a template or a JSON object)

      // const responseBody = mockApiRoute.responseTemplate
      //   ? mockApiRoute.responseTemplate.replace(
      //       /{{\s*([\w.]+)\s*}}/g,
      //       (_, key) => {
      //         return key.split(".").reduce((value, currentKey) => {
      //           return value[currentKey];
      //         }, mockApiRoute.response.body);
      //       }
      //     )
      //   : mockApiRoute.response.body;

      // Set the response body

      // let responseBody = mockApiRoute.response.body;
      // if (mockApiRoute.responseTemplate) {
      //   // Use a response template if provided
      //   const compiledTemplate = handlebars.compile(mockApiRoute.responseTemplate);
      //   responseBody = compiledTemplate({
      //     query: reqQueryParams,
      //     body: req.body,
      //   });
      // }

      // res.write(JSON.stringify(responseBody));
    } else {
      // Return a 404 error for unknown API routes
      res.statusCode = 404;
      res.end(`Cannot ${req.method.toUpperCase()} ${path}`);
    }
  });

  // Start the mock API server on a random port and save the address
  mockApiServer.listen(0, () => {
    mockApiServers.set(host, mockApiServer);
    console.log(
      "Mock API Server started for host: " +
        host +
        " at " +
        mockApiServer.address().port
    );
  });

  return mockApiServer;
}

// Create a new HTTP proxy server
const proxy = createProxyServer({});

function addMockApiRoute(mockApiServer, body) {
  const { method, path, queryParams, response, responseTemplate, createdAt } =
    body;

  // Add the route handler function to the mock API server
  mockApiServer.on("request", (req, res) => {
    if (req.method === method && req.url.split("?")[0] === path) {
      // Check that the query params match
      const reqQueryParams = querystring.parse(url.parse(req.url).query);
      if (JSON.stringify(reqQueryParams) !== JSON.stringify(queryParams)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/plain");
        res.end("Query params do not match expected values");
        return;
      }

      // Set the response headers
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value);
      }

      // Set the response body
      if (responseTemplate) {
        // Use a response template if provided
        const compiledTemplate = handlebars.compile(responseTemplate);
        const response = compiledTemplate({
          query: reqQueryParams,
          body: req.body,
        });
        res.end(response);
      } else {
        // Otherwise, use the provided response body
        res.setHeader("Content-Type", "application/json");
        res.statusCode = statusCode;
        res.end(JSON.stringify(responseBody));
      }
    }
  });

  // const Lmethod = method.toLowerCase();
  // server[Lmethod](path, (req, res) => {
  //   // Check if queryParams are provided and match the ones in the request
  //   if (queryParams) {
  //     const reqQueryParams = url.parse(req.url, true).query;
  //     const queryParamsMatch = Object.entries(queryParams).every(
  //       ([key, value]) => reqQueryParams[key] === value
  //     );
  //     if (!queryParamsMatch) {
  //       res.statusCode = 404;
  //       res.end(`Cannot ${method} ${path}`);
  //       return;
  //     }
  //   }

  //   // Set the response headers and status code
  //   res.writeHead(response.statusCode, response.headers);

  //   // Set the response body
  //   if (responseTemplate) {
  //     const template = Handlebars.compile(responseTemplate);
  //     const responseBody = template({ query: req.query, body: req.body });
  //     res.write(responseBody);
  //   } else if (response.body) {
  //     res.write(JSON.stringify(response.body));
  //   }

  //   res.end();
  // });

  console.log(
    `Added ${method} ${path} to mock API server (created at ${createdAt})`
  );
}

// ----------------------------End --------------------------------

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
    if (matchingHandler.responseTemplate) {
      for (let [key, value] of Object.entries(queryParams)) {
        let pattern = new RegExp(`{{${key}}}`, "g");
        responseBody = responseBody.replace(pattern, value);
      }
    }

    response.writeHead(
      matchingHandler.response.statusCode,
      matchingHandler.response.headers
    );
    const contentType = request.headers["content-type"];
    if (contentType === "application/json") {
      try {
        requestBody = JSON.parse(requestBody);
        response.end(JSON.stringify(requestBody));
      } catch (error) {
        response.statusCode = 400;
        response.end(`Invalid JSON: ${error.message}`);
        return;
      }
    } else {
      response.end(responseBody);
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
    responseTemplate = null
  ) {
    const route = new Route({
      method: method,
      path: path,
      queryParams: queryParams,
      response: response,
      responseTemplate: responseTemplate,
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
    server.on("error", (err) => {
      console.log(err);
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
      routeHandlers = routeHandlers.filter((el) => el._id != routeId);
      return res.status(200).send({ message: "Route deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  },
  createMockApiServer: async (req, res) => {
    try {
      const {host} = req.body;
      const server = await createMockApiServer(host);
      mockApiServers.set(host, server);
      // Return a success response
      res.status(200).json({ message: "Server Created successfully" });
    } catch (e) {
      res.status(403).json({ message: e.message });
    }
  },
  addMockApiRoute: async (req, res) => {
    try {
      const host = req.body.host;
      // Look up the mock API server for the requested host
      const mockApiServer = mockApiServers.get(host);
      await addMockApiRoute(mockApiServer, req.body);
      return res.status(200).send({ message: "Route added successfully" });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  },
  proxyMockApiRoute: async (req, res, next) => {
    const {host} = req.body;
    const mockApiServer = mockApiServers.get(host);
    const tmp = host.split(".");
    if (tmp.length > 2 && tmp[0].startsWith("api")) {
      if (mockApiServer) {
        // Forward the request to the mock API server
        proxy.web(req, res, {
          target: `http://localhost:${mockApiServer.address().port}`,
        });
      } else {
        // Return a 404 error for unknown app subdomains
        res.statusCode = 404;
        res.end(`Cannot GET ${host}`);
      }
    } else{
      next();
    }
  },
};
