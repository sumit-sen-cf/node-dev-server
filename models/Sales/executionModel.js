const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesBookingExecution = new Schema({
    sale_booking_id: {
        type: Number,
        required: false,
    },
    record_service_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesrecordservicemodels"
    },
    start_date: {
        type: String,
        required: false
    },
    end_date: {
        type: String,
        required: false
    },
    execution_status: {
        type: String,
        enum: ["sent_for_execution", "execution_accepted", "execution_completed",
            "execution_rejected", "execution_paused"],
        default: "sent_for_execution"
    },
    execution_time: {
        type: String,
        required: false
    },
    execution_date: {
        type: String,
        required: false
    },
    // execution_excel: {
    //     type: String,
    //     required: false,
    // },
    execution_done_by: {
        type: String,
        required: false,
    },
    execution_remark: {
        type: String,
        required: false,
    },
    commitment: {
        type: String,
        required: false,
    },
    // execution_sent_date: {
    //     type: String,
    //     required: false,
    // },
    execution_token: {
        type: Number,
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
module.exports = mongoose.model('salesBookingExecutionModel', salesBookingExecution);