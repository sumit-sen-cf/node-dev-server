const mongoose = require("mongoose");

const requestReplacementModel = new mongoose.Schema({
  assignment_type: {
    type: String,  // temp/permanent
    required: false,
  },
  old_asset_id: {
    type: Number,
    required: false,
    default : 0
  },
  new_asset_id: {
    type: Number,
    required: false,
    default : 0
  },

});

module.exports = mongoose.model("requestReplacementModel", requestReplacementModel);
