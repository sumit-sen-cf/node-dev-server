const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBadgesMaster = new Schema({
    badge_name: {
        type: String,
        required: false,
        trim: true,
    },
    badge_image: {
        type: String,
        required: false
    },
    max_rate_status: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
    },
    updated_by: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('salesBadgesMasterModel', salesBadgesMaster);