const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const exeCountHisModel = new mongoose.Schema({
  p_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  reach: {
    type: Number,
    required: false,
    default:0
  },
  impression:{
    type: Number,
    required: false,
    default:0
  },
  engagement:{
    type: Number,
    required: false,
    default:0
  },
  story_view:{
    type: Number,
    required: false,
    default:0
  },
  story_view_date:{
    type: Date,
    default:""
  },
  stats_for:{
    type: String,
    required: false,
    default: ""
  },
  start_date:{
    type: Date,
    required: false
  },
  end_date:{
    type: Date,
    required: false
  },
  media:{
    type: String,
    required: false,
    default: ""
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  reach_upload_image:{
    type: String,
    required: false,
    default: ""
  },
  impression_upload_image:{
    type: String,
    required: false,
    default: ""
  },
  engagement_upload_image:{
    type: String,
    required: false,
    default: ""
  },
  story_view_upload_image:{
    type: String,
    required: false,
    default: ""
  },
  story_view_upload_video:{
    type: String,
    required: false,
    default: ""
  },
  city1_name:{
    type: String,
    required: false,
    default: ""
  },
  city2_name:{
    type: String,
    required: false,
    default: ""
  },
  city3_name:{
    type: String,
    required: false,
    default: ""
  },
  city4_name:{
    type: String,
    required: false,
    default: ""
  },
  city5_name:{
    type: String,
    required: false,
    default: ""
  },
  percentage_city1_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_city2_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_city3_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_city4_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_city5_name:{
    type: Number,
    required: false,
    default: 0
  },
  city_image_upload:{
    type: String,
    required: false,
    default: ""
  },
  male_percent:{
    type: Number,
    required: false,
    default: 0
  },
  female_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_13_17_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_upload:{
    type: String,
    required: false,
    default: ""
  },
  Age_18_24_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_25_34_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_35_44_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_45_54_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_55_64_percent:{
    type: Number,
    required: false,
    default: 0
  },
  Age_65_plus_percent:{
    type: Number,
    required: false,
    default: 0
  },
  quater:{
    type: String,
    required: false,
    default: ""
  },
  profile_visit:{
    type: Number,
    required: false,
    default: 0
  },
  country1_name:{
    type: String,
    required: false,
    default: ""
  },
  country2_name:{
    type: String,
    required: false,
    default: ""
  },
  country3_name:{
    type: String,
    required: false,
    default: ""
  },
  country4_name:{
    type: String,
    required: false,
    default: ""
  },
  country5_name:{
    type: String,
    required: false,
    default: ""
  },
  percentage_country1_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_country2_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_country3_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_country4_name:{
    type: Number,
    required: false,
    default: 0
  },
  percentage_country5_name:{
    type: Number,
    required: false,
    default: 0
  },
  country_image_upload:{
    type: String,
    required: false,
    default: ""
  },
  stats_update_flag: {
    type: Boolean,
    default: false
  }

});

// AutoIncrement.initialize(mongoose.connection);
// vendorModel.plugin(AutoIncrement.plugin, {
//   model: "exeCountHisModels",
//   field: "p_id",
//   startAt: 1,
//   incrementBy: 1,
// });

module.exports = mongoose.model("exeCountHisModel", exeCountHisModel);
