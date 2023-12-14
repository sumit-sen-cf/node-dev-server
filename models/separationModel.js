const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const separationModel = new mongoose.Schema({
    id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
separationModel.plugin(
    AutoIncrement.plugin, 
    { model: 'separationModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('separationModel', separationModel);