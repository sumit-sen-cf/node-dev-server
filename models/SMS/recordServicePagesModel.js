const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordServicePages = new Schema({

    record_service_master_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "recordServiceMaster"
    },
    sale_booking_id: {
        type: Number,
        required: false,
    },
    sales_service_master_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesServiceMaster"
    },
    pageMast_id: {
        type: Number,
        required: false,
    },
    page_post_type: {
        type: String,
        required: false
    },
    page_rate: {
        type: Number,
        required: false
    },
    page_sale_rate: {
        type: Number,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    sale_executive_id: {
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
module.exports = mongoose.model('recordServicePages', recordServicePages);