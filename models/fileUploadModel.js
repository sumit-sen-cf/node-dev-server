const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const fileUploadSchema = new mongoose.Schema({
  fileId: {
    type: Number,
    required: false,
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

fileUploadSchema.pre('save', async function (next) {
  if (!this.fileId) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'fileId': -1 } });

    if (lastAgency && lastAgency.fileId) {
      this.fileId = lastAgency.fileId + 1;
    } else {
      this.fileId = 1;
    }
  }
  next();
});

module.exports = mongoose.model("fileUploadModel", fileUploadSchema);
