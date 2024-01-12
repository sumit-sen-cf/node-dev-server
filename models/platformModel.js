const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const platformModel = new mongoose.Schema({
    id:{
      type: Number,
      required: false
    },
    name:{
        type: String,
        required: true,
        default: 0
    },
    remark:{
        type: String,
        required: false,
        default: ""
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    created_by:{
        type: Number,
        required: false,
        default: 0
    },
    last_updated_at:{
        type: Date,
        default: Date.now
    },
    last_updated_by:{
        type: Number,
        required: false,
        default: 0
    }
});

platformModel.pre('save', async function (next) {
    if (!this.id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
  
      if (lastAgency && lastAgency.id) {
        this.id = lastAgency.id + 1;
      } else {
        this.id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('platformModel', platformModel);