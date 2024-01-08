const mongoose = require("mongoose");

const dataModel = new mongoose.Schema({
    data_name: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        required: false
    },
    data_type: {
        type: String,
        required: false,
        default: ""
    },
    size_in_mb: {
        type: Number,
        required: false,
        default: 0
    },
    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataCategoryModel"
    },
    sub_cat_id: {
        type: Number,
        required: false,
    },
    platform_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataPlatformModel"
    },
    content_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataContentTypeModel"
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataBrandModel"
    },
    data_upload: {
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

module.exports = mongoose.model("dataModel", dataModel);