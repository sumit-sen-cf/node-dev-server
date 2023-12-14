const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const leadSchema = new mongoose.Schema({
  leadsource_id: {
    type: Number,
    required: true,
    unique: true,
  },
  leadsource_name: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: ""
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: Number
  },
  Last_updated_by: {
    type: Number
  },
  Last_updated_date: {
    type: Date
  },
});

AutoIncrement.initialize(mongoose.connection);
leadSchema.plugin(AutoIncrement.plugin, {
  model: "leadModel",
  field: "leadsource_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("leadModel", leadSchema);

