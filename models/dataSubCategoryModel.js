const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const dataSubCategoryModel = new mongoose.Schema({
    data_sub_cat_name: {
        type: String,
        required: false,
        default: "",
    },
    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataCategoryModel"
    },
    remark: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('dataSubCategoryModel', dataSubCategoryModel);