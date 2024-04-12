const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesIncentiveSettelmentGst = new Schema({
    sale_booking_id: {
        type: Number,
        required: false,
    },
    sales_executive_id: {
        type: Number,
        required: false
    },
    sale_booking_date: {
        type: Date,
        required: false
    },
    record_service_amount: {
        type: Number,
        required: false
    },
    incentive_amount: {
        type: Number,
        required: false
    },
    maximum_incentive_amount: {
        type: Number,
        required: false
    },
    earning_status: {
        type: String,
        enu: ["earned", "unearned"],
    },
    settlement_status: {
        type: String,
        required: false,
    },
},
    { timestamps: true },
);
module.exports = mongoose.model('salesIncentiveSettelmentGst', salesIncentiveSettelmentGst);