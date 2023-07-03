const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require('http');
const cors = require("cors");
const routes = require("./routes/routes");
// const { createProxyMiddleware } = require("http-proxy-middleware");
const { createProxyServer } = require("http-proxy");
const MONGODB_URI = process.env.DB_CONNECTION_STRING;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(express.urlencoded({ extended: false }));
// Define a middleware function to check if the hostname is a subdomain
const isSubdomain = (req, res, next) => {
  const hostname = req.hostname;
  if (hostname.split('.').length > 2) { // Check if the hostname has more than two parts
    next(); // Pass control to the next middleware
  } else {
    res.status(400).send('Bad Request'); // Return a 400 error if the hostname is not a subdomain
  }
};

// Define a middleware function to log incoming requests
const logRequests = (req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware
};

// Define a middleware function to handle errors
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error'); // Return a 500 error for all errors
};

// Add the middlewares to the app
app.use(logRequests);
app.use(errorHandler);

// Define a function to create a reverse proxy for the target API
// const createReverseProxy = (req, res) => {
//   try{
//     const targetHostname = 'http://localhost:9292'; // Change this to the target domain
//     const targetPath = req.originalUrl; // Use the incoming request's path as the target path
  
//     const options = {
//       hostname: targetHostname,
//       path: targetPath,
//       method: req.method,
//       headers: req.headers,
//       agent: new http.Agent({ keepAlive: true }), // Use a persistent connection to the target server
//     };
  
//     const proxyReq = http.request(options, (proxyRes) => {
//       res.writeHead(proxyRes.statusCode, proxyRes.headers);
//       proxyRes.pipe(res);
//     });
  
//     req.pipe(proxyReq);
//   }
//   catch(err){
//     console.log(err);
//   }
// };

// Create a new HTTP proxy server
const proxy = createProxyServer({});

app.use((req,res,next) =>{
  const host = req.hostname;
  if(!host.startsWith('api')){
    proxy.web(req, res, {
      target: `http://localhost:9292`,
    });
  } else {
    next();
  }
});

// Routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Define a route for all incoming requests
// app.use(isSubdomain, createReverseProxy);
// setTimeout(()=>{
// },2000)