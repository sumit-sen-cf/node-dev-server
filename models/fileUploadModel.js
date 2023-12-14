const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const fileUploadSchema = new mongoose.Schema({
  fileId: {
    type: Number,
    required: true,
    unique: true,
  },
  contentSecRegId: {
    type: Number,
    ref: "contentSectionRegCmpModel"
  },
  contentSecFile: {
    type: String,
  },
});

AutoIncrement.initialize(mongoose.connection);
fileUploadSchema.plugin(AutoIncrement.plugin, {
  model: "fileUploadModel",
  field: "fileId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("fileUploadModel", fileUploadSchema);
