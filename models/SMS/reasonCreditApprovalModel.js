const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reasonCreditApproval = new Schema({
    reason: {
        type: String,
        required: false
    },
    day_count: {
        type: Number,
        required: false
    },
    reason_order: {
        type: Number,
        required: false
    },
    reason_type: {
        type: String,
        enum: ["fixed", "own_reason"],            //0=fixed,1=own reason
        required: false
    },
},
    { timestamps: true },
);
module.exports = mongoose.model('reasonCreditApproval', reasonCreditApproval);