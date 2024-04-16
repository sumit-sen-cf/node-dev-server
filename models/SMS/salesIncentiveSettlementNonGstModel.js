const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesIncentiveSettlementNonGst = new Schema({
    sales_executive_id: {
        type: Number,
        required: false
    },
    sale_booking_id: {
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
        required: false,
    },
    earning_status: {
        type: String,
        enum: ['earned', 'unearned'],
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('salesIncentiveSettlementNonGst', salesIncentiveSettlementNonGst);