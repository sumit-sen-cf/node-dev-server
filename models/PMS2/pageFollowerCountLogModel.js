const mongoose = require("mongoose");

const pageFollowerCountLogModel = new mongoose.Schema({
    page_name: {
        type: String,
        required: false,
    },
    follower_count: {
        type: Number,
        required: false,
        default: 0
    },
    story_price: {
        type: Number,
        required: false,
        default: 0
    },
    post_price: {
        type: Number,
        required: false,
        default: 0
    },
    both_price: {
        type: Number,
        required: false,
        default: 0
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

module.exports = mongoose.model("pageFollowerCountLogModel", pageFollowerCountLogModel);
