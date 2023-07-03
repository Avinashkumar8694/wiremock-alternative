const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require('http');
const cors = require("cors");
const routes = require("./routes/routes");
const {proxyMockApiRoute } = require("./mockServer/mockServer");
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

app.use(proxyMockApiRoute)
// Routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});