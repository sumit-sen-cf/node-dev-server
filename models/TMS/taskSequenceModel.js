const { default: mongoose } = require("mongoose");
const deptWiseStatusModel = require("./deptWiseStatusModel");

const taskSequenceModel = new mongoose.Schema({
    sequence: {
        type: Number,
        required: true,
        unique: true
    },
    status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deptWiseStatusModel"
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
 "taskSequenceModel",
 taskSequenceModel   
)