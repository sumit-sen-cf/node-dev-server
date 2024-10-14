const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const incentiveSharingServices = new Schema({
    account_id: {
        type: Number,
        required: true
    },
    service_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "salesservicemastermodels"
    },
    user_id: {
        type: Number,
        required: true,
        ref: "usermodels"
    },
    user_percentage: {
        type: Number,
        required: true
    },
    service_percentage: {
        type: Number,
        required: true
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

// Ensure unique combination of account_id, service_id and user_id
incentiveSharingServices.index({
    account_id: 1,
    service_id: 1,
    user_id: 1
}, {
    unique: true
});

module.exports = mongoose.model('salesIncentiveSharingServicesModel', incentiveSharingServices);
