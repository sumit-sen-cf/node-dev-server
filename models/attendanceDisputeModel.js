const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const attendanceDisputeModel = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    attendence_id: {
        type: Number,
        required: true
    },
    dispute_status: {
        type: String,
        required: false,
        default: "",
    },
    dispute_reason: {
        type: String,
        required: false,
        default: "",
    },
    dispute_date: {
        type: String
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        default: 0
    },
    last_updated_date: {
        type: Date,
        default: 0
    }
});

module.exports = mongoose.model("attendanceDisputeModel", attendanceDisputeModel);
