const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesServiceMaster = new Schema({
    service_name: {
        type: String,
        required: false
    },
    post_type: {
        type: String,
        required: false
    },
    amount_status: {
        type: String,
        enu: ["calculated", "input"],
    },
    is_excel_upload: {
        type: Boolean,
        required: false
    },
    no_of_hours_status: {
        type: Boolean,
        required: false
    },
    goal_status: {
        type: Boolean,
        required: false
    },
    day_status: {
        type: Boolean,
        required: false
    },
    quantity_status: {
        type: Boolean,
        required: false
    },
    brand_name_status: {
        type: Boolean,
        required: false
    },
    hashtag: {
        type: Boolean,
        required: false
    },
    indiviual_amount_status: {
        type: Boolean,
        required: false
    },
    start_end_date_status: {
        type: Boolean,
        required: false
    },
    per_month_amount_status: {
        type: Boolean,
        required: false
    },
    no_of_creators: {
        type: Boolean,
        required: false
    },
    deliverables_info: {
        type: Boolean,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('salesServiceMaster', salesServiceMaster);