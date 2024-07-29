const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesPaymentMode = new Schema({
    payment_mode_name: {
        type: String,
        required: true,
        trim: true
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
module.exports = mongoose.model('salesPaymentModeModel', salesPaymentMode);