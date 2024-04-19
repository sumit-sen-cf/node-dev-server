const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phpPMSPagePurchaseModel = new mongoose.Schema({
    pageMast_id: {
        type: Number,
        required: true
    },
    page_user_name: {
        type: String,
        required: false,
        default: ""
    },
    cat_name: {
        type: String,
        required: false,
        default: ""
    },
    platform: {
        type: String,
        required: false,
        default: ""
    },
    followers_count: {
        type: Number,
        required: false,
        default: 0
    },
    link: {
        type: String,
        required: false,
        default: ""
    },
    vendorMast_id: {
        type: Number,
        required: false,
        default: 0
    },
    page_level: {
        type: String,
        required: false,
        default: ""
    },
    page_status: {
        type: String,
        required: false,
        default: ""
    },
    page_catg_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    tag_category: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }],
    price_type: {
        type: String,
        required: false,
        default: ""
    },
    story: {
        type: Number,
        required: false,
        default: 0
    },
    post: {
        type: Number,
        required: false,
        default: 0
    },
    both_: {
        type: Number,
        required: false,
        default: 0
    },
    multiple_cost: {
        type: String,
        required: false,
        default: ""
    },
    otherstory: {
        type: Number,
        required: false,
        default: 0
    },
    otherpost: {
        type: Number,
        required: false,
        default: 0
    },
    otherboth: {
        type: Number,
        required: false,
        default: 0
    },
    promotion_type: {
        type: String,
        required: false,
        default: ""
    },
    page_ownership: {
        type: String,
        required: false,
        default: ""
    },
    page_closed_by: {
        type: Number,
        required: false,
        default: 0
    },
    page_name_type: {
        type: Number,
        required: false,
        default: 0
    },
    content_creation: {
        type: Number,
        required: false,
        default: 0
    },
    created_by: {
        type: String,
        required: false,
        default: ""
    },
    update_date: {
        type: String,
        required: false,
        default: ""
    },
    updated_by: {
        type: String,
        required: false,
        default: ""
    },
});

module.exports = mongoose.model("phpPMSPagePurchaseModel", phpPMSPagePurchaseModel);