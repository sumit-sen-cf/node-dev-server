const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const roomModel = new mongoose.Schema({
    room_id: { 
        type: Number,
        required: false,
        unique: true,
    },
    sitting_ref_no: {
        type: String,
        required: false,
        unique:true
    },
    roomImage: {
        type: String,
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
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
   
});

roomModel.pre('save', async function (next) {
    if (!this.room_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'room_id': -1 } });
  
      if (lastAgency && lastAgency.room_id) {
        this.room_id = lastAgency.room_id + 1;
      } else {
        this.room_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('roomModel', roomModel);