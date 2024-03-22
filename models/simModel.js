const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const simModel = new mongoose.Schema({
  sim_id: {
    type: Number,
    required: false,
    unique: true,
  },
  sim_no: {
    type: String,
    required: false,
    default: ""
  },
  Remarks: {
    type: String,
    required: false,
    default: "",
  },
  created_by: {
    type: Number,
    required: true,
  },
  status: {                                                                       //status:[Available,Allocated,Stolen,Lost,Send To Vendor,Scrap]
    type: String,
    default: "Available",
  },
  new_status: {
    type: String,
    required: false
  },
  s_type: {
    type: String,
    required: false,
    default: "",
  },
  assetsName: {
    type: String,
    required: false,
    default: "",
  },
  assetsOtherID: {
    type: String,
    required: false,
    default: "",
  },
  category_id: {
    type: Number,
    required: true,
  },
  sub_category_id: {
    type: Number,
    required: true,
  },
  vendor_id: {
    type: Number,
    required: true,
  },
  inWarranty: {
    type: String,
    required: true,
    default: "",
  },
  warrantyDate: {
    type: String,
    default: "",
  },
  dateOfPurchase: {
    type: String,
    default: "",
  },
  selfAuditPeriod: {
    type: Number,
    required: false,
    default: 0,
  },
  selfAuditUnit: {
    type: String,
    required: false,
    default: 0,
  },
  hrAuditPeriod: {
    type: Number,
    required: false,
    default: 0,
  },
  hrAuditUnit: {
    type: String,
    required: false,
    default: 0,
  },
  invoiceCopy: {
    type: String,
    required: false,
    default: "",
  },
  hr_audit_status: {
    type: String,
    default: "Done",
  },
  self_audit_status: {
    type: String,
    default: "Done",
  },
  assetsValue: {
    type: Number,
    required: false,
    default: 0,
  },
  assetsCurrentValue: {
    type: Number,
    required: false,
    default: 0,
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
  Last_updated_date: {
    type: Date,
    default: Date.now,
  },
  hrAuditFlag: {
    type: Boolean,
    default: true,
  },
  selfAuditFlag: {
    type: Boolean,
    default: true,
  },
  last_hr_audit_date: {
    type: Date,
    default: Date.now
  },
  last_self_audit_date: {
    type: Date,
    default: Date.now
  },
  next_hr_audit_date: {
    type: Date,
    default: ""
  },
  next_self_audit_date: {
    type: Date,
    default: ""
  },
  asset_financial_type: {
    type: String,
    required: false,
    default: "",
  },
  depreciation_percentage: {
    type: Number,
    required: false,
    default: 0,
  },
  asset_brand_id: {
    type: Number,
    required: false
  },
  asset_modal_id: {
    type: Number,
    required: false
  },
  all_status_remark: {
    type: String,
    required: false,
    default: ""
  },
  all_status_date: {
    type: String,
    required: false
  }
});

simModel.pre('save', async function (next) {
  if (!this.sim_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'sim_id': -1 } });

    if (lastAgency && lastAgency.sim_id) {
      this.sim_id = lastAgency.sim_id + 1;
    } else {
      this.sim_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("simModel", simModel);