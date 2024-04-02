const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesService = new Schema({
    service_name: {
        type: String,
        required: false
    },
    post_type: {
        type: String,
        required: false
    },
    is_excel_upload: {
        type: Boolean,       
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('salesService', salesService);