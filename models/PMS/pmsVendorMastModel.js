const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsVendorMastSchema = new Schema({
    vendorMast_id: {
        type: Number,
        required: false,
    },
    type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsVendorTypeModel"
    },
    platform_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPlatform"
    },
    payMethod_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPayMethod"
    },
    cycle_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPayCycle"
    },
    vendorMast_name: {
        type: String,
        required: true
    },
    country_code: {
        type: Number,
        required: false
    },
    mobile: {
        type: Number,
        required: false
    },
    alternate_mobile: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    personal_address: {
        type: String,
        required: false
    },
    pan_no: {
        type: String,
        required: false
    },
    upload_pan_image: {
        type: String,
        required: false
    },
    gst_no: {
        type: String,
        required: false
    },
    upload_gst_image: {
        type: String,
        required: false
    },
    company_name: {
        type: String,
        required: false
    },
    company_address: {
        type: String,
        required: false
    },
    company_city: {
        type: String,
        required: false
    },
    company_pincode: {
        type: Number,
        required: false
    },
    company_state: {
        type: String,
        required: false
    },
    threshold_limit: {
        type: Number,
        required: false
    },
    home_address: {
        type: String,
        required: false
    },
    home_city: {
        type: String,
        required: false
    },
    home_state: {
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
pmsVendorMastSchema.pre('save', async function (next) {
    if (!this.vendorMast_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'vendorMast_id': -1 } });

        if (lastAgency && lastAgency.vendorMast_id) {
            this.vendorMast_id = lastAgency.vendorMast_id + 1;
        } else {
            this.vendorMast_id = 1;
        }
    }
    next();
});

const pmsVendorMastModel = mongoose.model("pmsVendorMast", pmsVendorMastSchema);
module.exports = pmsVendorMastModel;