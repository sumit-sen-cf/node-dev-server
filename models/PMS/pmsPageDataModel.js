const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPageData = new Schema({
    pageMast_id: {
        type: Number,              //pmsPageMast refrence 
        required: false,
    },
    page_name: {
        type: String,
        required: false,
    },
    page_link: {
        type: String,
        required: true
    },
    page_level: {
        type: String,
        required: true
    },
    page_status: {
        type: String,
        required: false
    },
    page_category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPageCategory"
    },
    tag_category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pmsPageCategory"
    }],
    follower_count: {
        type: Number,
        required: true,
    },
    price_type: {
        type: Number,
        required: true,
    },
    story: {
        type: Number,
        required: true,
    },
    post: {
        type: Number,
        required: true,
    },
    both: {
        type: Number,
        required: true,
    },
    vendorMast_id: {
        type: Number,                      //ref - vendor_id
        required: true,
    },
    multiple_cost: {
        type: String,
        enum: ['yes', 'no'],
    },
    other_story: {
        type: Number,
        required: false,
    },
    other_post: {
        type: Number,
        required: false
    },
    other_both: {
        type: Number,
        required: true,
    },
    platform: {
        type: String,
        required: false,
    },
    promotion_type: {
        type: String,
        required: false,
    },
    page_ownership: {
        type: String,
        required: false,
    },
    page_closed_by: {
        type: Number,
        required: false,
    },
    page_name_type: {
        type: Number,
        required: false,
    },
    content_creation: {
        type: Number,
        required: false,
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
}, { timestamps: true },
);

module.exports = mongoose.model('pmsPageData', pmsPageData);