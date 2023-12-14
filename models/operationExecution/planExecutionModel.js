const { default: mongoose } = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");

const phaseExecutionSchema = new mongoose.Schema({
    
});


module.exports = mongoose.model(
  "PhaseExecutionModel",
  phaseExecutionSchema
);
