const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const separationModel = new mongoose.Schema({
    id:{
        type: Number,
        required: false
    },
    user_id:{
        type: Number,
        required: false,
        default: 0
    },
    reason:{
        type: String,
        required: true
    },
    remark:{
        type: String,
        required: false
    },
    status:{
        type: String,
        required: false,
        default: ""
    },
    resignation_date:{
        type: Date,
        required: false,
        default: Date.now
    },
    last_working_date:{
        type: Date,
        required: false,
        default: Date.now
    },
    reinstate_date:{
        type: Date,
        required: false,
        default: Date.now
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

separationModel.pre('save', async function (next) {
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

module.exports = mongoose.model('separationModel', separationModel);