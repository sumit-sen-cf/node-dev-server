const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pageLanguageSchema = new Schema({
    language_name: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        required: false,
    },
    updated_by: {
        type: Number,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('pageLanguageModel', pageLanguageSchema);