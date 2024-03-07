const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsVendorGroupLinkSchema = new Schema({
    vendorMast_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsVendorMast"
    },
    group_link_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsgrouplink"
    },
    group_link: {
        type: String,
        required: true
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
const pmsVendorGroupLinkModel = mongoose.model("pmsVendorgrouplink", pmsVendorGroupLinkSchema);
module.exports = pmsVendorGroupLinkModel;