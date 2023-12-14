const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const responsibilityModel = new mongoose.Schema({
    id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
responsibilityModel.plugin(
    AutoIncrement.plugin, 
    { model: 'responsibilityModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('responsibilityModel', responsibilityModel);