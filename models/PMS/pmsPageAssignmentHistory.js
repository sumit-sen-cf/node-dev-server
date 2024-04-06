const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPageAssignmentHistorySchema = new Schema({
    page_id: {
        type: Number,
        required: false,
        default: 0
    },
    assignment_by: {
        type: Number,
        required: false,
        default: 0
    },
    assignment_to: {
        type: Number,
        required: false,
        default: 0
    },
    engagement_duration: {
        type: Number,
        required: false,
        default: 0
    },
    start_date: {
        type: Date,
        required: false,
    },
    end_date: {
        type: Date,
        required: false,
    }
}, {
    timestamps: true
});

const pmsPageAssignmentHistoryModel = mongoose.model("pmsPageAssignmentHistory", pmsPageAssignmentHistorySchema);
module.exports = pmsPageAssignmentHistoryModel;