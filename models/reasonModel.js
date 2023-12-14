const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const reasonModel = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    reason:{
        type: String,
        required: true,
        unique:true
    },
    remark:{
        type: String,
        required: false
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
reasonModel.plugin(
    AutoIncrement.plugin, 
    { model: 'reasonModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('reasonModel', reasonModel);