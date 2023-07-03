const http = require('http');
const httpProxy = require('http-proxy');

// Define the target servers that the proxies will forward requests to
const servers = [
  { host: 'localhost', port: 3000 },
  { host: 'localhost', port: 4000 },
  { host: 'localhost', port: 5000 }
];

// Create a proxy server for each target server
const proxies = servers.map((server) => {
  const proxy = httpProxy.createProxyServer({
    target: server
  });

  // Handle proxy errors
  proxy.on('error', (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Proxy error: ${err.message}`);
  });

  return proxy;
});

// Create a HTTP server for each proxy
proxies.forEach((proxy, index) => {
  const server = http.createServer((req, res) => {
    console.log(`Proxy ${index + 1} received request for: ${req.url}`);
    proxy.web(req, res);
  });

  server.listen(8000 + index, () => {
    console.log(`Proxy ${index + 1} listening on port ${server.address().port}`);
  });
});
