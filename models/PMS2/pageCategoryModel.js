const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pageCategorySchema = new mongoose.Schema({
    page_category_name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: "",
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        reqxuired: false,
        default: 0,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Pms2PageCategoryModel", pageCategorySchema);