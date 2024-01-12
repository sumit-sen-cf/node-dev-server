const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const vendorModel = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: false,
  },
  vendor_name: {
    type: String,
    required: false,
    unique:true,
    default: "",
  },
  vendor_contact_no:{
    type: String,
    required: false,
    default: "",
  },
  vendor_email_id:{
    type: String,
    required: false,
    default: "",
  },
  vendor_address:{
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: Number,
    required: false,
    default: 0,
  },
  last_updated_by: {
    type: Number,
    default:0
  },
  last_updated_date: {
    type: Date,
    default:0
  },
  vendor_type: {
    type: String,
    required: false
  },
  vendor_category: {
    type: [String],
    required: false
  },
  secondary_contact_no : {
    type: String,
    required: false,
    default: "",
  },
  secondary_person_name : {
    type: String,
    required: false,
    default: "",
  }
});

vendorModel.pre('save', async function (next) {
  if (!this.vendor_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'vendor_id': -1 } });

    if (lastAgency && lastAgency.vendor_id) {
      this.vendor_id = lastAgency.vendor_id + 1;
    } else {
      this.vendor_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("vendorModel", vendorModel);
