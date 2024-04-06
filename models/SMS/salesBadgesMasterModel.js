const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBadges = new Schema({
    badge_name: {
        type: String,
        required: false
    },
    badge_image: {
        type: String,
        required: false
    },
    max_rate_status: {
        type: Number,
        required: false
    },
    managed_by: {
        type: Number,
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
},
    { timestamps: true },
);
module.exports = mongoose.model('salesBadges', salesBadges);