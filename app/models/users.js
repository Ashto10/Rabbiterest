'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var User = new Schema({
  twitter: {
    id: String,
    displayName: String,
    iconURL: String
  },
  links: [{
    imageURI: String
  }]
});

module.exports = mongoose.model('User', User);