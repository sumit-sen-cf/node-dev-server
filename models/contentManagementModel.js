const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const contentMgntModel = new mongoose.Schema({
    contentM_id: { 
        type: Number,
        required: true,
        unique: true,
    },
    page_name: {
        type: String,
        required: true
    },
    content_name: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: false,
    },
    sub_category: {
        type: Number,
        required: false,
    },
    content: {
        type: String,
        default: "",
    },
    reason: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    uploaded_by: {
        type: Date,
        default: Date.now
    }
});

AutoIncrement.initialize(mongoose.connection);
contentMgntModel.plugin(
    AutoIncrement.plugin, 
    { model: 'contentMgntModels', field: 'contentM_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('contentMgntModel', contentMgntModel);