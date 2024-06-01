const mongoose = require("mongoose");
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
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('salesPaymentModeModel', salesPaymentMode);