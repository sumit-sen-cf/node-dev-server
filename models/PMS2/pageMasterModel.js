const mongoose = require("mongoose");
const constant = require("../../common/constant");
const { required } = require("joi");
const Schema = mongoose.Schema;

const pageMasterSchema = new Schema({
    p_id: {
        type: Number,
        required: false,
        unique: true
    },
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
    page_sub_category_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: ""
    },
    temp_page_category_id: {
        type: Number,
        required: false,
    },
    platform_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2VendorPlatformModel"
    },
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Pms2VendorModel"
    },
    page_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    primary_page: {
        type: String,
        enum: ["Yes", "No"],
        required: false,
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
    page_mast_status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
    page_activeness: {
        type: String,
        required: false
    },
    temp_vendor_id: {
        type: Number,
        required: false
    },
    story: {
        type: Number,
        required: false
    },
    post: {
        type: Number,
        required: false
    },
    both_: {
        type: Number,
        required: false
    },
    m_post_price: {
        type: Number,
        required: false,
    },
    m_story_price: {
        type: Number,
        required: false,
    },
    m_both_price: {
        type: Number,
        required: false,
    },
    bio: {
        type: String,
        required: false,
        default: ""
    }
}, {
    timestamps: true
});

pageMasterSchema.pre('save', async function (next) {
    if (!this.p_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'p_id': -1 } });

        if (lastAgency && lastAgency.p_id) {
            this.p_id = lastAgency.p_id + 1;
        } else {
            this.p_id = 1;
        }
    }
    next();
});

pageMasterSchema.index({ page_name: 1 })

const pageMasterModel = mongoose.model("Pms2PageMasterModel", pageMasterSchema);
module.exports = pageMasterModel;
