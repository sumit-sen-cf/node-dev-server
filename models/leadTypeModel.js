const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const leadTypeSchema = new mongoose.Schema({
  leadtype_id: {
    type: Number,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    default: ""
  },
  lead_type: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: ""
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
  Created_by: {
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
leadTypeSchema.plugin(AutoIncrement.plugin, {
  model: "leadTypeModel",
  field: "leadtype_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("leadTypeModel", leadTypeSchema);

