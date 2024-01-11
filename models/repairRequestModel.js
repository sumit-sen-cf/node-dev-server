const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const repairRequestModel = new mongoose.Schema({
    repair_id: {
        type: Number,
        required: true,
    },
    sim_id: {
        type: Number,
        required: false,
    },
    repair_request_date_time: {
        type: Date,
        required: false,
        default: ""
    },
    priority: {
        type: String,
        required: false,
        default: "Low"
    },
    problem_detailing: {
        type: String,
        required: false,
        default: ""
    },
    multi_tag: {
        type: [String],
        required: false,
        default: ""
    },
    img1: {
        type: String,
        required: false,
        default: ""
    },
    img2: {
        type: String,
        required: false,
        default: ""
    },
    img3: {
        type: String,
        required: false,
        default: ""
    },
    img4: {
        type: String,
        required: false,
        default: ""
    },
    recovery_remark: {
        type: String,
        required: false,
        default: ""
    },
    recovery_image_upload1: {
        type: String,
        required: false,
        default: ""
    },
    recovery_image_upload2: {
        type: String,
        required: false,
        default: ""
    },
    recovery_by: {
        type: Number,
        required: false,
        default: 0
    },
    recovery_date_time: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    req_by: {
        type: Number,
        required: false,
    },
    req_date: {
        type: Date,
        default: Date.now,
    },
    asset_reason_id: {
        type: Number,
        required: false,
        default: 0
    },
    acknowledge_date: {
        type: Date,
        default: "",
    },
    acknowledge_remark: {
        type: String,
        default: "",
    },
    submission_date: {
        type: Date,
        default: Date.now,
    },
    submission_remark: {
        type: String,
        default: "",
    },
    resolved_date: {
        type: Date,
        default: Date.now,
    },
    resolved_remark: {
        type: String,
        default: "",
    },
    scrap_remark: {
        type: String,
        default: "",
    },
    accept_date_time: {
        type: Date,
        default: Date.now,
    },
    accept_by: {
        type: Number,
        required: false,
        default: 0
    }
});

AutoIncrement.initialize(mongoose.connection);
repairRequestModel.plugin(AutoIncrement.plugin, {
    model: "repairRequestModels",
    field: "repair_id",
    startAt: 1,
    incrementBy: 1,
});
module.exports = mongoose.model(
    "repairRequestModel",
    repairRequestModel
);
