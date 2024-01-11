const { default: mongoose } = require("mongoose");
const taskModel = require("./taskModel");

const taskDeliveryModel = new mongoose.Schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "taskModel"
    },
    delivery_date_time: {
        type: Date,
        required: false
    },
    delivery_status: {
        type: String,
        required: false
    },
    changes_date_time:{
        type: Date,
        required: false
    },
    changes_summary:{
        type: String,
        required: false,
        default: ""
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
 "taskDeliveryModel",
 taskDeliveryModel   
)