const mongoose = require('mongoose');

const expenseModel = new mongoose.Schema({
    account_details: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: ''
    },
    amount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    reference_number: {
        type: String,
        default: ""
    },
    expense_category: {
        type: mongoose.Types.ObjectId,
        ref: '',
        required: true
    },
    assigned_to: {
        type: Number,
        required: false,
        default: 0
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    },
    last_updated_by: {
        type: String,
        required: false,
        default: ""
    },
    creation_date: {
        type: String,
        default: ""
    },
    updated_date: {
        type: String,
        default: ""
    },
    minor_status: {
        type: String,
        default: ""
    },
    major_status: {
        type: String,
        default: ""
    },
    upload_bill: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('expenseModel', expenseModel);
