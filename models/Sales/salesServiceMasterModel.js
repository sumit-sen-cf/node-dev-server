const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesServiceMaster = new Schema({
    service_name: {
        type: String,
        required: false,
        trim: true
    },
    post_type: {
        type: String,
        required: false
    },
    amount_status: {
        type: String,
        enum: ["calculated", "input"],
    },
    // is_excel_upload: {
    //     type: Boolean,
    //     required: false,
    //     default: false,
    // },
    no_of_hours_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    goal_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    day_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    quantity_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    brand_name_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    hashtag: {
        type: Boolean,
        required: false,
        default: false,
    },
    indiviual_amount_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    start_end_date_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    per_month_amount_status: {
        type: Boolean,
        required: false,
        default: false,
    },
    no_of_creators: {
        type: Boolean,
        required: false,
        default: false,
    },
    deliverables_info: {
        type: Boolean,
        required: false,
        default: false,
    },
    remarks: {
        type: String,
        required: false
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
module.exports = mongoose.model('salesServiceMasterModel', salesServiceMaster);