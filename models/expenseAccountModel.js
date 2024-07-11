const { default: mongoose } = require("mongoose");

const expenseAccountModel = new mongoose.Schema({
    account_name: {
        type: String,
        required: true,
        unique: false
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model(
    "expenseAccountModel",
    expenseAccountModel
);