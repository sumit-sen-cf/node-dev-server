const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const exePurchaseModel = new mongoose.Schema({
  p_id: {
    type: Number,
    required: true
  },
  page_name: {
    type: String,
    required: false,
    default:""
  },
  cat_name:{
    type: String,
    required: false,
    default:""
  },
  platform:{
    type: String,
    required: false,
    default:""
  },
  follower_count:{
    type: Number,
    required: false,
    default:0
  },
 page_link:{
    type: String,
    required: false,
    default:""
 },
 vendor_id:{
    type: Number,
    required: false,
    default:0
 }
});

// AutoIncrement.initialize(mongoose.connection);
// vendorModel.plugin(AutoIncrement.plugin, {
//   model: "exeCountHisModels",
//   field: "p_id",
//   startAt: 1,
//   incrementBy: 1,
// });

module.exports = mongoose.model("exePurchaseModel", exePurchaseModel);
