const mongoose = require("mongoose");

// const subCategorySchema = new mongoose.Schema({
//     subCategoryId: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "dataSubCategoryModel"
//     }]
// });

const dataModel = new mongoose.Schema({
    data_id: {
        type: Number,
        required: false,
        unique: true
    },
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
    // sub_cat_id: subCategorySchema,
    sub_cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataSubCategoryModel"
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
    },
    designed_by: {
        type: Number,
        required: false,
        default: 0
    },
    date_of_completion: {
        type: String,
        default: ""
    },
    date_of_report: {
        type: String,
        default: ""
    },
    brand_category_id: {
        type: Number,
        default: 0
    },
    brand_sub_category_id: {
        type: Number,
        default: 0
    },
    campaign_purpose: {
        type: String,
        default: ""
    },
    number_of_post: {
        type: Number,
        default: 0
    },
    number_of_reach: {
        type: String,
        default: "NA"
    },
    number_of_impression: {
        type: String,
        default: "NA"
    },
    number_of_engagement: {
        type: String,
        default: "NA"
    },
    number_of_views: {
        type: String,
        default: "NA"
    },
    number_of_story_views: {
        type: String,
        default: "NA"
    },
    operation_remark: {
        type: String,
        default: ""
    },
    mmc: {
        type: String,
        required: false
    },
    sarcasm: {
        type: String,
        required: false
    },
    no_logo: {
        type: String,
        required: false
    }
});

dataModel.pre('save', async function (next) {
    if (!this.data_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'data_id': -1 } });

        if (lastAgency && lastAgency.data_id) {
            this.data_id = lastAgency.data_id + 1;
        } else {
            this.data_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model("dataModel", dataModel);