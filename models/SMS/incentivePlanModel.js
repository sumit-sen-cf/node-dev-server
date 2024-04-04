const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incentivePlan = new Schema({
    sales_service_master_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesServiceMaster"
    },
    incentive_type: {
        type: String,
        enu: ["fixed", "varaible"],
    },
    value: {
        type: Number,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    managed_by: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
    },
    last_updated_by: {
        type: Number,
        required: false,
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('incentivePlan', incentivePlan);