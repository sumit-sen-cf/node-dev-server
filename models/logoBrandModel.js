const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const logoBrandModel = new mongoose.Schema({
    logo_id:{
        type: Number,
        required: true,
        unique: true
    },
    brand_name: { 
        type: String,
        required: false,
        default: "",
    },
    image_type: {
        type: String,
        required: false,
        default: ""
    },
    size:{
        type: String,
        required: false,
        default: ""
    },
    size_in_mb:{
        type: Number,
        required: false,
        default: 0
    },
    last_updated_at:{
        type: Date,
        default: Date.now
    },
    last_updated_by:{
        type: Number,
        required: false,
        default: 0 
    },
    remarks:{
        type: String,
        required: false,
        default: ""
    },
    logo_cat:{
        type: Number,
        required: true
    },
    upload_logo:{
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
        required: true,
        default: 0
    }
});

// AutoIncrement.initialize(mongoose.connection);
// logoBrandModel.plugin(
//     AutoIncrement.plugin, 
//     { model: 'logoBrandModels', field: 'logo_id', startAt: 1, incrementBy: 1 }
// );

module.exports = mongoose.model('logoBrandModel', logoBrandModel);