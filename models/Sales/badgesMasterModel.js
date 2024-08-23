const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constant = require("../../common/constant");

const salesBadges = new Schema({
    badge_name: {
        type: String,
        trim: true,
        unique: true,
        required: false
    },
    // badge_image: {
    //     type: String,
    //     required: false
    // },
    min_rate_amount: {
        type: Number,
        required: false
    },
    max_rate_amount: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: false
    },
    updated_by: {
        type: Number,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('salesBadgesMasterModel', salesBadges);