const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const roomModel = new mongoose.Schema({
    room_id: { 
        type: Number,
        required: true,
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

AutoIncrement.initialize(mongoose.connection);
roomModel.plugin(
    AutoIncrement.plugin, 
    { model: 'roomModel', field: 'room_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('roomModel', roomModel);