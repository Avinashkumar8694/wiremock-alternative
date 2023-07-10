const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
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
  },
  subDomain: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    validate: {
      validator: async function (value) {
        const org = await mongoose.model('Domain').findById(value);
        return org !== null;
      },
      message: 'Invalid Domain'
    }
    
  }
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
