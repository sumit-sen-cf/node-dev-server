const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const objMastSchema = new mongoose.Schema({
  obj_id: {
    type: Number,
    required: true,
    unique: true,
  },
  obj_name: {
    type: String,
    unique:true,
    default: ""
  },
  soft_name: {
    type: String,
    default: "",
  },
  Dept_id: {
    type: Number,
    default: 0,
  },

  Created_by: {
    type: Number,
    default: 0,
  },
  Last_updated_by: {
    type: Number,
  },
  Last_updated_date: {
    type: Date,
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);
objMastSchema.plugin(AutoIncrement.plugin, {
  model: "objectModel",
  field: "obj_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("objectModel", objMastSchema);
