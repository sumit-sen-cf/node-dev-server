const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const sittingModel = new mongoose.Schema({
    sitting_id: { 
        type: Number,
        required: true,
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

AutoIncrement.initialize(mongoose.connection);
sittingModel.plugin(
    AutoIncrement.plugin, 
    { model: 'sittingModels', field: 'sitting_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('sittingModel', sittingModel);