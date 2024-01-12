const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const logoCategoryModel = new mongoose.Schema({
    id:{
        type: Number,
        required: false
    },
    cat_name: { 
        type: String,
        required: false,
        default: "",
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    }
});

logoCategoryModel.pre('save', async function (next) {
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

module.exports = mongoose.model('logoCategoryModel', logoCategoryModel);