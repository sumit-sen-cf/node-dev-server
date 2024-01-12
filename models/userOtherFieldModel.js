const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const userOtherFieldModel = new mongoose.Schema({
    user_id:{
        type: Number,
        required: false
    },
    field_name:{
        type: String,
        required: false
    },
    field_value:{
        type: String,
        required: false,
        default: ""
    },
    remark:{
        type: String,
        required: false,
        default: ""
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
    },
    lastupdated_by:{
        type: Date,
        required: false,
        default: Date.now
    }
});

userOtherFieldModel.pre('save', async function (next) {
    if (!this.user_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'user_id': -1 } });
  
      if (lastAgency && lastAgency.user_id) {
        this.user_id = lastAgency.user_id + 1;
      } else {
        this.user_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('userOtherFieldModel', userOtherFieldModel);