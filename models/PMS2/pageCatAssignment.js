const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constant = require("../../common/constant");

const pageCatAssignment = new Schema({
    user_id: {
        type: Number,
        required: false,
        unique: false
    },
    page_master_id: {
        type: mongoose.Types.ObjectId,
        ref: "",
        required: false,
        unique: false
    },
    // page_category_id: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "",
    //     required: false,
    //     unique: false
    // },
    page_sub_category_id: {
        type: mongoose.Types.ObjectId,
        ref: "pagecatassignments",
        required: false,
        unique: false
    },
    created_by: {
        type: Number,
        required: false
    },
    updated_by: {
        type: Number,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("pageCatAssignment", pageCatAssignment);