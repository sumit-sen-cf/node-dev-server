const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPageOwnershipSchema = new Schema({
    ownership_type: {
        type: String,
        required: true
    },
    pageMast_id: {
        type: Number,
        required: true,
    },
    vendorMast_id: {
        type: Number,
        required: true,
    },
    sharing_per: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});
const pmsPageOwnershipModel = mongoose.model("pmsPageOwner", pmsPageOwnershipSchema);
module.exports = pmsPageOwnershipModel;