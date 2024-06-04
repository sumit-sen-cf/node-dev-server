const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const recordServicePages = new Schema({
    record_service_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "salesRecordServiceModel"
    },
    sale_booking_id: {
        type: Number,
        required: true,
        ref: "salesBookingModel"
    },
    sales_service_master_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "salesServiceMasterModel"
    },
    page_master_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Pms2PageMasterModel"
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
module.exports = mongoose.model('salesRecordServicePageModel', recordServicePages);