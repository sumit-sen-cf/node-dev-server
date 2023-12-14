const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const userOtherFieldModel = new mongoose.Schema({
    user_id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
userOtherFieldModel.plugin(
    AutoIncrement.plugin, 
    { model: 'userOtherFieldModels', field: 'user_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('userOtherFieldModel', userOtherFieldModel);