const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBookingExecution = new Schema({
    sale_booking_id: {
        type: Number,
        required: false,
    },
    record_service_mast_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "recordServiceMaster"
    },
    start_date: {
        type: Date,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    execution_status: {
        type: String,
        enum: ["pending_for_sent_execution", "Sent_for_execution", "execution_accepted", "execution_completed",
            "execution_rejected", "execution_paused"],
    },
    execution_time: {
        type: String,
        required: false
    },
    execution_date: {
        type: Date,
        required: false
    },
    execution_excel: {
        type: String,
        required: false,
    },
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
    execution_sent_date: {
        type: String,
        required: false,
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
module.exports = mongoose.model('salesBookingExecution', salesBookingExecution);