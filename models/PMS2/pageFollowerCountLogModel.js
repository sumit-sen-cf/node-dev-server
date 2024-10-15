const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageFollowerCountLogModel = new mongoose.Schema({
    page_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2PageMasterModel"
    },
    page_name: {
        type: String,
        required: false,
    },
    follower_count: {
        type: Number,
        required: false,
        default: 0
    },
    bio: {
        type: String,
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

module.exports = mongoose.model("pageFollowerCountLogModel", pageFollowerCountLogModel);
