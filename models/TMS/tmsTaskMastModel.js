const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tmsTask = new Schema(
    {
        cat_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "tmsCatMastModel"
        },
        sub_cat_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "tmsSubCatMast"
        },
        status_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "tmsStatusMastModel"
        },
        sub_status_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "tmsSubStatusMast"
        },
        task_name: {
            type: String,
            required: true
        },
        start_date: {
            type: Date,
            require: false
        },
        assign_to: {
            type: Array,
            required: true,
        },
        assign_by: {
            type:Number,
            required: true,
        },
        due_date: {
            type: Date,
            require: true
        },
        ageing: {
            type: String,
            require: false,
        },
        task_health: {
            type: String,
            require: true
        },
        task_description: {
            type: String,
            require: true
        },
        attachments: {
            type: String,
            default: ""
        },
        task_type: {
            type: String,
            require: true
        },
        priority: {
            type: String,
            require: true
        },
        score: {
            type: Number,
            require: false
        },
    });
const tmsTaskModel = mongoose.model("tmsTask", tmsTask);
module.exports = tmsTaskModel;