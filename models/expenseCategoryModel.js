const { default: mongoose } = require("mongoose");

const expenseCategoryModel = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true,
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
    "expenseCategoryModel",
    expenseCategoryModel
);