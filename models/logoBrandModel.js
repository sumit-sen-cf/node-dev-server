const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const logoBrandModel = new mongoose.Schema({
    id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
logoBrandModel.plugin(
    AutoIncrement.plugin, 
    { model: 'logoBrandModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('logoBrandModel', logoBrandModel);