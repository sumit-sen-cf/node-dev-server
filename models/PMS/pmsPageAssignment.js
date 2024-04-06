const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPageAssignmentSchema = new Schema({
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
    description: {
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
}, {
    timestamps: true
});

const pmsPageAssignmentModel = mongoose.model("pmsPageAssignment", pmsPageAssignmentSchema);
module.exports = pmsPageAssignmentModel;