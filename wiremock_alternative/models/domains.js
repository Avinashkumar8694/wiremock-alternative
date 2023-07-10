const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true,
    validate: {
      validator: async function (value) {
        const org = await mongoose.model('Org').findById(value);
        return org !== null;
      },
      message: 'Invalid organization'
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Domain', domainSchema);
