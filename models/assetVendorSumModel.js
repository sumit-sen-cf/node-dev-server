const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetVendorSumModel = new mongoose.Schema({
    sim_id: {
        type: Number,
        required: false,
    },
    vendor_id: {
        type: Number,
        required: false,
    },
    send_date: {
        type: String,
        required: false
    },
    send_by: {
        type: Number,
        required: false,
    },
    expected_date_of_repair: {
        type: String,
        required: false
    },
    vendor_status: {
        type: String,
        required: false,
        default: "0"
    },
    vendor_recieve_date: {
        type: Date,
    },
    vendor_recieve_remark: {
        type: String,
        required: false,
        default: ""
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

// assetBrandModel.pre('save', async function (next) {
//     if (!this.asset_brand_id) {
//         const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_brand_id': -1 } });

//         if (lastAgency && lastAgency.asset_brand_id) {
//             this.asset_brand_id = lastAgency.asset_brand_id + 1;
//         } else {
//             this.asset_brand_id = 1;
//         }
//     }
//     next();
// });

module.exports = mongoose.model(
    "assetVendorSumModel",
    assetVendorSumModel
);
