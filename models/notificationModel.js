const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const notificationModel = new mongoose.Schema({
  user_id: {
    type: Number,
    required: false
  },
  notification_title: {
    type: String,
    required: true
  },
  notification_message: {
    type: String,
    required: true
  },
  notification_show: {
    type: Boolean,
    required: false,
    default: true
  },
  readen:{
    type: Boolean,
    required: false,
    default: false
  },
  created_by: {
    type: Number,
    required: false,
    default: 0,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("notificationModel", notificationModel);