const mongoose = require("mongoose");

const dataBrandModel = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model("dataBrandModel", dataBrandModel);