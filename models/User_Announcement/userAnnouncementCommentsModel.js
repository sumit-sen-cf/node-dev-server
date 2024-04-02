const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentAnnouncementSchema = new mongoose.Schema({
    announcement_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("userAnnouncementCommentsModel", commentAnnouncementSchema);