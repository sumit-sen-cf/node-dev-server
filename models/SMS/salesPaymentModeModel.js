const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesPaymentMode = new Schema({
    payment_mode_name: {
        type: String,
        required: false,
    },
    managed_by: {
        type: Number,
        required: false,
    },
    created_by: {
        type: Number,
        required: true,
    },
    last_updated_by: {
        type: Number,
        required: true,
    },
}, { timestamps: true },

);
module.exports = mongoose.model('salesPaymentMode', salesPaymentMode);