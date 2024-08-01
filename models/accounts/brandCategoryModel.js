const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const accountBrandCategorySchema = new mongoose.Schema({
    brand_category_name: {
        type: String,
        required: true,
        unique: true
    },
    created_by: {
        type: Number,
        required: false,
    },
    updated_by: {
        type: Number,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("accountBrandCategoryModel", accountBrandCategorySchema);