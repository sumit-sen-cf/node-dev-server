const { default: mongoose } = require("mongoose");

const industrySchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"industry name is required"],
    unique:true
  },
  description:{
    type:String,
  }
});

module.exports = mongoose.model(
  "IndustryMaster",
  industrySchema
);
