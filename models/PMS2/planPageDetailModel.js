const mongoose = require("mongoose");

// plan_status = open , close

const planPageDetailModel = new mongoose.Schema({
    planx_id: {
        type: mongoose.Types.ObjectId,
        ref: "planxlogmodels",
        required: true
    },
    page_name: {
        type: String,
        required: false,
    },
    post_count: {
        type: Number,
        required: false,
        default: 0
    },
    story_count: {
        type: Number,
        required: false,
        default: 0
    },
    post_price: {
        type: Number,
        required: false,
        default: 0
    },
    story_price: {
        type: Number,
        required: false,
        default: 0
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    created_by: {
        type: Number,
        required: false,
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

module.exports = mongoose.model("planPageDetailModel", planPageDetailModel);
