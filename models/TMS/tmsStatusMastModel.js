const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tmsStatusMastModel = new Schema(
  {
    status_name: {
        type: String,
        required: true 
    },
    dept_id: {
        type: Number,
        required: true,
        ref: "departmentModel"
    },
    description: {
        type: String,
        required: false
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});
const tmsStatusModel = mongoose.model("tmsStatusMastModel",tmsStatusMastModel);
module.exports = tmsStatusModel;