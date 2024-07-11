const mongoose = require('mongoose');

const expenseModel = new mongoose.Schema({
    account_details: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'expenseAccountModel'
    },
    transaction_date: {
        type: Date,
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
        ref: 'expenseCategoryModel',
        required: false
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
        type: Number,
        required: false,
        default: 0
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
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
