const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const paymentDeatils = new Schema({
    title: {
        type: String,
        required: false,
        trim: true
    },
    details: {        //bank_details
        type: String,
        required: false,
        trim: true
    },
    gst_bank: {
        type: Boolean,   //1,0 = check if bank is gst or non gst_amount
        required: false
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    updated_by: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});
module.exports = mongoose.model('salesPaymentDeatilsModel', paymentDeatils);