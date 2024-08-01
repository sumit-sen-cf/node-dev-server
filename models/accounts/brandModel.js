const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const accountBrandSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
        unique: true
    },
    brand_category_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "accountBrandCategoryModel"
    },
    brand_image: {
        type: String,
        required: false,
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

module.exports = mongoose.model("accountBrandModel", accountBrandSchema);