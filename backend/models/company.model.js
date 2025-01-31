const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  isValidated: {
    type: Boolean,
    default: false
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
});

module.exports = mongoose.model('Company', companySchema); 