const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const contentTypeSchema = new mongoose.Schema({
  content_type_id: {
    type: Number,
    required: true,
    unique: true,
  },
  content_type: {
    type: String,
    default:"",
    lowercase: true,
    trim: true,
  },
  content_value: {
    type: Number,
  },
  remarks: {
    type: String,
  },
  created_by: {
    type: Number,
  },
  last_updated_by: {
    type: Number,
  },
  last_updated_date : {
    type: Date,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);
contentTypeSchema.plugin(AutoIncrement.plugin, {
  model: "contentTypeModel",
  field: "content_type_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("contentTypeModel", contentTypeSchema);


