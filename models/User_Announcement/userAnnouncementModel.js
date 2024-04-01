const { default: mongoose } = require("mongoose");

const commentsType = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    comment: [{
        type: String,
        required: true,
    }],
}, {
    timestamps: true
});

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
        type: Boolean,
        required: false,
    },
    dept_id: {
        type: [Number],
        required: false,
        default: []
    },
    desi_id: {
        type: [Number],
        required: false,
        default: []
    },
    job_type: {
        type: Array,
        required: false,
    },
    image: {
        type: [String],
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    attachment: {
        type: [String],
        required: false,
    },
    notify_by_user_email: {
        type: Boolean,
        required: true,
    },
    email_response: {
        type: String,
        required: true,
    },
    target_audience_count: {
        type: Number,
        required: false,
    },
    reactions: {
        like: Array,
        haha: Array,
        love: Array,
        clap: Array,
        sad: Array,
    },
    commentsHistory: {
        type: [commentsType]
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