const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const reasonModel = new mongoose.Schema({
    id:{
        type: Number,
        required: false
    },
    reason:{
        type: String,
        required: true,
        unique:true
    },
    remark:{
        type: String,
        required: false
    },
    created_at:{
        type: Date,
        required: false,
        default: Date.now
    },
    created_by:{
        type: Number,
        required: false,
        default: 0
    }
});

reasonModel.pre('save', async function (next) {
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

module.exports = mongoose.model('reasonModel', reasonModel);