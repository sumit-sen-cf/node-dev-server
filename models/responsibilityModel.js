const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const responsibilityModel = new mongoose.Schema({
    id:{
        type: Number,
        required: false
    },
    respo_name: { 
        type: String,
        required: true,
        unique:true,
        default: ""
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    Last_updated_by: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    }
});

responsibilityModel.pre('save', async function (next) {
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

module.exports = mongoose.model('responsibilityModel', responsibilityModel);