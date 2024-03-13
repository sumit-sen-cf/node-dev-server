const { default: mongoose } = require("mongoose");

const userAnnouncementSchema = new mongoose.Schema({
    post_content: {
        type: String,
        required: true,
    },
    post_subject: {
        type: String,
        required: true,
    },
    all_emp: {
        type: String,
        required: false,
    },
    dept_id: {
        type: Number,
        required: false,
    },
    desi_id: {
        type: Number,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    attachment: {
        type: String,
        required: false,
    },
    notify_by_user_email: {
        type: Boolean,
        required: true,
    },
    email_respone: {
        type: String,
        required: true,
    },
    target_audience_count: {
        type: Number,
        required: true,
    },
    created_by: {
        type: Number,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("UserAnnouncement", userAnnouncementSchema);