const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentDeatils = new Schema({
    title: {
        type: String,
        required: false
    },
    details: {                  //bank_details
        type: String,
        required: false
    },
    gst_bank: {
        type: Boolean,         //1,0 = check if bank is gst or non gst_amount
        required: false
    },
    managed_by: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('paymentDeatils', paymentDeatils);