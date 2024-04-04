const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');

const phpPaymentAccListModel = new mongoose.Schema({
    id: {
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
    gst_bank: {
        type: Number,
        required: false
    },
    payment_type: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    is_hide: {
        type: Boolean,
        required: false,
        default: false
    },
    created_at: {
        type: String,
        required: false
    },
    sno: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('phpPaymentAccListModel', phpPaymentAccListModel);