const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const designationModel = new mongoose.Schema({
    desi_id:{
        type: Number,
        required: true,
        unique:true
    },
    dept_id:{
        type: Number,
        required: true
    },
    desi_name: { 
        type: String,
        required: false,
        unique:true,
        default: ""
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
    last_updated_at: {
        type: Date,
        default: ""
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    }
});

AutoIncrement.initialize(mongoose.connection);
designationModel.plugin(
    AutoIncrement.plugin, 
    { model: 'designationModels', field: 'desi_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('designationModel', designationModel);