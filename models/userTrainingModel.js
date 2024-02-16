const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const userTrainingModel = new mongoose.Schema({
    user_id: {
        type: Number,
        required: false,
    },
    created_by: {
        type: Number,
        required: false
    },
    remark: {
        type: String,
        required: false,
        default: "",
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("userTrainingModel", userTrainingModel);
