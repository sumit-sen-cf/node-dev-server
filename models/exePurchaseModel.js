const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const exePurchaseModel = new mongoose.Schema({
  p_id: {
    type: String,
    required: true
  },
  page_name: {
    type: String,
    required: false,
    default: ""
  },
  cat_name: {
    type: String,
    required: false,
    default: ""
  },
  platform: {
    type: String,
    required: false,
    default: ""
  },
  follower_count: {
    type: Number,
    required: false,
    default: 0
  },
  page_link: {
    type: String,
    required: false,
    default: ""
  },
  vendor_id: {
    type: Number,
    required: false,
    default: 0
  },
  page_level: {
    type: String,
    required: false,
    default: ""
  },
  page_status: {
    type: String,
    required: false,
    default: ""
  },
  page_category: {
    type: Number,
    required: false,
    default: 0
  },
  tag_category: {
    type: String
  },
  price_type: {
    type: String,
    required: false,
    default: ""
  },
  story: {
    type: Number,
    required: false,
    default: 0
  },
  post: {
    type: Number,
    required: false,
    default: 0
  },
  both_: {
    type: Number,
    required: false,
    default: 0
  },
  multiple_cost: {
    type: String,
    required: false,
    default: ""
  },
  otherstory: {
    type: Number,
    required: false,
    default: 0
  },
  otherpost: {
    type: Number,
    required: false,
    default: 0
  },
  otherboth: {
    type: Number,
    required: false,
    default: 0
  },
  promotion_type: {
    type: String,
    required: false,
    default: ""
  },
  page_ownership: {
    type: String,
    required: false,
    default: ""
  },
  page_closed_by: {
    type: Number,
    required: false,
    default: 0
  },
  page_name_type: {
    type: Number,
    required: false,
    default: 0
  },
  content_creation: {
    type: Number,
    required: false,
    default: 0
  },
  created_by: {
    type: String,
    required: false,
    default: ""
  },
  update_date: {
    type: String,
    required: false,
    default: ""
  },
  updated_by: {
    type: String,
    required: false,
    default: ""
  },
});

module.exports = mongoose.model("exePurchaseModel", exePurchaseModel);
