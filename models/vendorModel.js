const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const vendorModel = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true,
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
});

AutoIncrement.initialize(mongoose.connection);
vendorModel.plugin(AutoIncrement.plugin, {
  model: "vendorModels",
  field: "vendor_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("vendorModel", vendorModel);
