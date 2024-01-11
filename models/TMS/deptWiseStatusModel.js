const { default: mongoose } = require("mongoose");

const deptWiseStatusModel = new mongoose.Schema({
    dept_id: {
        type: Number,
        required: true,
    },
    // dept_name: {
    //     type: String,
    //     required: true
    // },
    status: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model(
    "deptWiseStatusModel",
    deptWiseStatusModel
);
