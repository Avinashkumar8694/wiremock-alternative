const mongoose = require('mongoose');

const schema = {
  method: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  queryParams: {
    type: Object,
    required: false
  },
  response: {
    statusCode: {
      type: Number,
      required: true
    },
    headers: {
      type: Object,
      required: true
    },
    body: {
      type: Object,
      required: false
    }
  },
  responseTemplate: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}

const routeSchema = new mongoose.Schema(schema);

const Route = mongoose.model('Route', routeSchema);

module.exports = {
  Route: Route,
  routeSchema: schema
}
