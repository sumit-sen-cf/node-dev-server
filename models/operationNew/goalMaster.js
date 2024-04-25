const { default: mongoose } = require("mongoose");

const goalSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Goal name is required"],
    unique:true
  },
  description:{
    type:String,
  }
});

module.exports = mongoose.model(
  "goalMaster",
  goalSchema
);
