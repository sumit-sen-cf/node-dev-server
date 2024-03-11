const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPageMastSchema = new Schema({
    page_user_name: {
        type: String,
        required: true
    },
    pageMast_id: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: true
    },
    platform_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPlatform"
    },
    page_catg_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPageCategory"
    },
    tag_category: {
        type: Array,
        required: false,
    },
    page_level: {
        type: String,
        required: true,
    },
    page_status: {
        type: String,
        required: true,
    },
    page_closed_by: {
        type: Number,
        required: true,
    },
    page_name_type: {
        type: String,
        required: true,
    },
    content_creation: {
        type: String,
        required: true,
    },
    ownership_type: {
        type: String,
        required: true,
    },
    vendorMast_Id: {
        type: Number,
        required: true,
        // ref: "pmsVendorMast"
    },
    followers_count: {
        type: Number,
        required: true,
    },
    profile_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsProfileType"
    },
    platform_active_on: {
        type: String,
        required: true,
    },
    engagment_rate: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});
pmsPageMastSchema.pre('save', async function (next) {
    if (!this.pageMast_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'pageMast_id': -1 } });

        if (lastAgency && lastAgency.pageMast_id) {
            this.pageMast_id = lastAgency.pageMast_id + 1;
        } else {
            this.pageMast_id = 1;
        }
    }
    next();
});

const pmsPageMastModel = mongoose.model("pmsPageMast", pmsPageMastSchema);
module.exports = pmsPageMastModel;