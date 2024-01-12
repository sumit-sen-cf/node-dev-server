const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectxRecordSchema = new mongoose.Schema({
  record_id: {
    type: Number,
    required: false,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  page_id: {
    type: Number,
    required: true,
  },
  page_name: {
    type: String,
    required: true,
  },
  page_user_id: {
    type: Number,
    required: true,
    default: 0,
  },
  followers: {
    type: Number
  },
  profile_type: {
    type: String
  },
  page_category: {
    type: Number
  },
  posted_time: {
    type: Date,
    default: Date.now,
  },
  category:{
    type:Number
  },
  subcategory:{
    type:Number
  },
  cbname:{
    type:Number
  },
  campaign_id:{
    type:Number
  },
  major_category:{
    type:String,
    default: "",
  },
  igusername: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  remark: {
    type: String,
    default: "",
  },
  whatsapp: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  postlink: {
    type: String,
    default: "",
  },
  post_video_path: {
    type: String,
    default: "",
  },
  post_title: {
    type: String,
    default: "",
  },
  post_type: {
    type: String,
    default: "",
  },
  storylink: {
    type: String,
    default: "",
  },
  agency: {
    type: Number
  },
  hash_tag: {
    type: String,
    default: "",
  },
  post_content: {
    type: String,
    default: "",
  },
  story_content: {
    type: String,
    default: "",
  },
  added_by: {
    type: Number
  },
  recorded_at: {
    type: Date,
    default: Date.now,
  },
});

projectxRecordSchema.pre('save', async function (next) {
  if (!this.record_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'record_id': -1 } });

    if (lastAgency && lastAgency.record_id) {
      this.record_id = lastAgency.record_id + 1;
    } else {
      this.record_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("projectxRecord", projectxRecordSchema);
