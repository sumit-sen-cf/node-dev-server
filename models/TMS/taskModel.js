const { default: mongoose } = require("mongoose");
const deptWiseStatusModel = require("./deptWiseStatusModel");

const taskModel = new mongoose.Schema({
    task_title: {
        type: String,
        required: true
    },
    task_description: {
        type: String,
        required: true
    },
    assigned_to: {
        type: Array,
        required: false
    },
    deliver_to:{
        type: Array,
        required: false
    },
    aging:{
        type: Number,
        required: false,
        default: 10
    },
    review:{
        type: String,
        required: false
    },
    rating:{
        type: Number,
        required: false
    },
    task_status: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    updated_by: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model(
 "taskModel",
 taskModel   
)