const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesIncentivePlan = new Schema({
    sales_service_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesServiceMasterModel"
    },
    incentive_type: {
        type: String,
        required: false,
        enum: ["fixed", "varaible"],
    },
    value: {
        type: Number,
        required: false
    },
    remarks: {
        type: String,
        required: false,
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
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('salesIncentivePlanModel', salesIncentivePlan);