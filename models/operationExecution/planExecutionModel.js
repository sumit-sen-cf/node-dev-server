const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const phaseExecutionSchema = new mongoose.Schema({
  
});






module.exports = mongoose.model(
  "PhaseExecutionModel",
  phaseExecutionSchema
);
