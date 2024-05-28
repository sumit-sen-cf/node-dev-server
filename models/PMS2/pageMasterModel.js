const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pageMasterSchema = new Schema({
    page_profile_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2PageProfileTypeModel"
    },
    page_category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2PageCategoryModel"
    },
    platform_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2VendorPlatformModel"
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2VendorModel"
    },
    page_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    page_name_type: {
        type: String,
        required: false,
        trim: true
    },
    page_link: {
        type: String,
        required: false,
        trim: true
    },
    preference_level: {
        type: String,
        required: false,
        trim: true
    },
    content_creation: {
        type: String,
        required: false,
        trim: true
    },
    ownership_type: {
        type: String,
        required: false,
        trim: true
    },
    rate_type: {
        type: String,
        required: false,
        trim: true
    },
    variable_type: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    page_closed_by: {
        type: Number,
        required: false,
    },
    followers_count: {
        type: Number,
        required: false,
    },
    engagment_rate: {
        type: Number,
        required: false,
    },
    tags_page_category: {
        type: Array,
        required: false,
    },
    platform_active_on: {
        type: Array,
        required: false,
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});
const pageMasterModel = mongoose.model("Pms2PageMasterModel", pageMasterSchema);
module.exports = pageMasterModel;
