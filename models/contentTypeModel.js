const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const contentTypeSchema = new mongoose.Schema({
  content_type_id: {
    type: Number,
    required: false,
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

contentTypeSchema.pre('save', async function (next) {
  if (!this.content_type_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'content_type_id': -1 } });

    if (lastAgency && lastAgency.content_type_id) {
      this.content_type_id = lastAgency.content_type_id + 1;
    } else {
      this.content_type_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("contentTypeModel", contentTypeSchema);