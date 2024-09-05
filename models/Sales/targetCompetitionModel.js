const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesTargetCompetition = new Schema({
    competition_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    target_amount: {
        type: Number,
        required: true,
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
module.exports = mongoose.model('salesTargetCompetitionModel', salesTargetCompetition);