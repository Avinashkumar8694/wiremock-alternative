const http = require("http");
const url = require("url");
const { createProxyServer } = require("http-proxy");
const handlebars = require('handlebars');

// Create an empty map to store mock API servers
const mockApiServers = new Map();

// Create a function to create a new mock API server
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

// Create a new HTTP proxy server
const proxy = createProxyServer({});
// Create a new HTTP server to handle requests
const server = http.createServer((req, res) => {
  const host = req.headers.host;
  const urlObj = url.parse(req.url);
  const path = urlObj.pathname;

  if (host.startsWith("app.")) {
    // Check if a mock API server exists for the requested host
    const mockApiServer = mockApiServers.get(host);

    if (mockApiServer) {
      // Forward the request to the mock API server
      proxy.web(req, res, {
        target: `http://localhost:${mockApiServer.address().port}`,
      });
    } else {
      // Return a 404 error for unknown app subdomains
      res.statusCode = 404;
      res.end(`Cannot GET ${path}`);
    }
  } else if (path === "/createMockApiServer") {
    // Create a new mock API server for the requested host
    const mockApiServer = createMockApiServer();
    mockApiServers.set(host, mockApiServer);

    res.statusCode = 201;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Mock API server created for ${host}`);
  } else if (path === "/addMockApiRoute") {
    // Parse the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const {
        method,
        path: route,
        queryParams = {},
        response: {
          statusCode = 200,
          headers = {},
          body: responseBody = {},
        } = {},
        responseTemplate,
        createdAt = new Date(),
      } = JSON.parse(body);

      // Look up the mock API server for the requested host
      const mockApiServer = mockApiServers.get(host);

      if (mockApiServer) {
        // Add the route handler function to the mock API server
        mockApiServer.on("request", (req, res) => {
          if (req.method === method && req.url.split("?")[0] === route) {
            // Check that the query params match
            const reqQueryParams = querystring.parse(url.parse(req.url).query);
            if (
              JSON.stringify(reqQueryParams) !== JSON.stringify(queryParams)
            ) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "text/plain");
              res.end("Query params do not match expected values");
              return;
            }

            // Set the response headers
            for (const [key, value] of Object.entries(headers)) {
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

        res.statusCode = 201;
        res.setHeader("Content-Type", "text/plain");
        res.end(`Mock API route added to ${host}: ${method} ${route}`);
      } else {
        // Return a 404 error if no mock API server exists for the requested host
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end(`No mock API server exists for ${host}`);
      }
    });
  } else {
    // Return a 404 error for unknown routes
    res.statusCode = 404;
    res.end(`Cannot ${req.method} ${req.url}`);
  }
});

// Start the HTTP server listening on port 9000
server.listen(9000, () => {
  console.log("Server listening on port 9000");
});
