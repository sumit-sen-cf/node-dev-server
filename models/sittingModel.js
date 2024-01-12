const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const sittingModel = new mongoose.Schema({
    sitting_id: { 
        type: Number,
        required: false,
        unique: true,
    },
    sitting_ref_no: {
        type: String,
        required: false,
        unique:true
    },
    sitting_area: {
        type: String,
        required: false,
    },
    remarks: {
        type: String,
        required: false,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: false,
    },
    last_updated_by: {
        type: Number,
        required: false,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
    room_id: {
        type: Number,
        required: false
    },
});

sittingModel.pre('save', async function (next) {
    if (!this.sitting_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'sitting_id': -1 } });
  
      if (lastAgency && lastAgency.sitting_id) {
        this.sitting_id = lastAgency.sitting_id + 1;
      } else {
        this.sitting_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('sittingModel', sittingModel);