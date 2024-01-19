const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const cocNewModel = new mongoose.Schema({
    coc_content: {
        type: String,
        required: true
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    updated_by: {
        type: Number,
        required: false,
        default: 0,
    },
    updated_date: {
        type: Date,
        default: Date.now,
    }
});
module.exports = mongoose.model("cocNewModel", cocNewModel);