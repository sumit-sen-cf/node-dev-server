const { default: mongoose } = require("mongoose");

const agencySchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Agency name is required"],
    unique:true,
  },
  mobile:{
    type:Number
  },
  alternateMobile:{
    type:Number
  },
  email:{
    type:String
  },
  city:{
    type:String
  },
  instagram:{
    type:String
  },
  remark:{
    type:String
  }
});

module.exports = mongoose.model(
  "AgencyMaster",
  agencySchema
);
