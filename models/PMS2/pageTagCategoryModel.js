const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pageTagCategorySchema = new Schema({
    page_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2PageMasterModel"
    },
    page_name: {
        type: String,
        required: true
    },
    page_category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2PageCategoryModel"
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
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


const pageTagCategoryModel = mongoose.model("pageTagCategoryModel", pageTagCategorySchema);
module.exports = pageTagCategoryModel;
