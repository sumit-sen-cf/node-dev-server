const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bulkVendorModel = new Schema({
    page_name: {
        type: String,
        required: true
    },
    page_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: ''
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: ''
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: ''
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
    both: {
        type: Number,
        required: false,
        default: 0
    },
    m_story: {
        type: Number,
        required: false,
        default: 0
    },
    m_post: {
        type: Number,
        required: false,
        default: 0
    },
    m_both: {
        type: Number,
        required: false,
        default: 0
    },
    reel: {
        type: Number,
        required: false,
        default: 0
    },
    carousel: {
        type: Number,
        required: false,
        default: 0
    },
}, { timestamps: true });

bulkVendorModel.index({
    vendor_id: 1,
    page_name: 1
}, {
    unique: true
});

module.exports = mongoose.model('bulkVendorModel', bulkVendorModel);
